const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require('uuid');
const { prisma } = require("../config/db");
const { AppError } = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");
const { verifyRefreshToken, createTokens } = require("../utils/tokenService");
const {
    hashPassword,
    generateVerificationToken,
    comparePassword,
    generateVerificationCode
} = require("../utils/jwt");
const {
    sendVerificationEmail,
    sendResetPasswordEmail
} = require("../services/email.service");
const ActivityService = require("../services/activity.service");
const { checkCaptcha } = require("../middlewares/auth.middleware");


exports.createUser = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError('Données invalides', 400, errors.array()));
    }

    const { email, password, phoneNumber, firstName, lastName, captchaToken } = req.body;

    // Vérification CAPTCHA
    if (!captchaToken) {
        return next(new AppError('CAPTCHA requis', 400));
    }

    const captchaVerification = await checkCaptcha(captchaToken);
    if (!captchaVerification.success) {
        return next(new AppError('CAPTCHA invalide', 400));
    }

    // Vérifie si email ou phone déjà utilisés
    const existing = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { phone: phoneNumber }],
        },
    });

    if (existing) {
        return next(new AppError("Identifiants invalides", 409));
    }

    // Hasher le mot de passe
    const hash = await hashPassword(password);

    // Générer un code de vérification email
    const verificationCode = await generateVerificationCode();

    // Créer l'utilisateur
    const user = await prisma.user.create({
        data: {
            email: email,
            phone: phoneNumber,
            password: hash,
            firstName,
            lastName,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
        }
    });

    await prisma.email.create({
        data: {
            email: email,
            types: ['PRIMARY', 'CONTACT'],
            userId: user.id,
            isLoginAllowed: true,
            notifications: true,
        }
    })

    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 heures

    // Stocker le code généré
    await prisma.verificationCode.create({
        data: {
            code: verificationCode,
            type: 'EMAIL_VERIFICATION',
            userId: user.id,
            email: user.email,
            attempts: 1,
            expiresAt: expiry
        }
    });

    // Envoyer email de vérification
    await sendVerificationEmail(user, verificationCode, expiry);

    // ✅ Logger l'activité via le service
    await ActivityService.log(user.id, "SIGNUP", "Nouvelle inscription", req);

    res.status(201).json({
        success: true,
        status: 'success',
        message: 'Inscription réussie. Veuillez vérifier votre email.',
        user: user
    });
});

exports.signin = catchAsync(async (req, res, next) => {
    const { emailOrPhone, password, rememberMe, captchaToken } = req.body;

    if (!captchaToken) return next(new AppError('CAPTCHA requis', 400));
    const captchaVerified = await checkCaptcha(captchaToken);
    if (!captchaVerified.success) return next(new AppError('CAPTCHA invalide', 400));

    const user = await prisma.user.findFirst({
        where: { OR: [{ email: emailOrPhone }, { phone: emailOrPhone }] },
    });
    if (!user) return next(new AppError('Identifiants invalides', 401));

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) return next(new AppError('Identifiants invalides', 401));

    // Reset des tentatives + log
    await prisma.user.update({
        where: { id: user.id },
        data: { loginAttempts: 0, lockUntil: null, lastLogin: new Date() },
    });

    const expiry = rememberMe ? 30 : 7;
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + expiry * 24 * 60 * 60 * 1000);

    await prisma.session.create({
        data: {
            userId: user.id,
            token,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            expiresAt,
        },
    });

    // 🍪 Création du cookie partagé entre sous-domaines
    res.cookie('adscity.sid', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: process.env.NODE_ENV === 'production' ? '.adscity.net' : 'localhost',
        maxAge: expiry * 24 * 60 * 60 * 1000,
    });

    await ActivityService.log(user.id, 'SIGNIN', 'Connexion réussie', req);

    res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
            lastLogin: user.lastLogin,
        },
    });
});

exports.whoami = catchAsync(async (req, res) => {
    const token = req.cookies['adscity.sid'];
    if (!token) return res.status(401).json({ authenticated: false });

    const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
    });

    if (!session || session.expiresAt < new Date() || session.isRevoked) {
        return res.status(401).json({ authenticated: false });
    }

    res.json({
        authenticated: true,
        user: session.user,
        expiresAt: session.expiresAt,
    });
});

exports.refreshToken = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return next(new AppError('Token de rafraîchissement manquant', 401));
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
        return next(new AppError('Token de rafraîchissement invalide', 401));
    }

    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, isActive: true }
    });

    if (!user || !user.isActive) {
        return next(new AppError('Utilisateur non trouvé', 404));
    }

    const { accessToken, refreshToken: newRefreshToken } = createTokens(user.id);

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
        status: 'success',
        data: { accessToken }
    });
});

exports.signOut = catchAsync(async (req, res, next) => {
    req.session.destroy(err => {
        if (err) return next(new AppError('Erreur de déconnexion', 500));

        res.clearCookie('adscity.sid', {
            domain: '.adscity.net',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });

        res.json({ success: true, message: 'Déconnecté avec succès' });
    });
});

exports.forgotPassword = catchAsync(async (req, res) => {
    const { email, captchaToken } = req.body;

    // Vérification CAPTCHA
    if (!captchaToken) {
        return next(new AppError('Vérification CAPTCHA requise', 400));
    }

    const captchaVerification = await checkCaptcha(captchaToken);
    if (!captchaVerification.success) {
        return next(new AppError('CAPTCHA invalide', 400));
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return res.json({
            success: true,
            status: 'success',
            message: 'Si cet email existe, un lien de réinitialisation a été envoyé.'
        });
    }

    // Générer token de réinitialisation du mot de passe
    const resetToken = generateVerificationToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    // Stocker en base de données
    await prisma.verificationToken.create({
        data: {
            userId: user.id,

            token: resetToken,
            type: 'PASSWORD_RESET',
            expiresAt: resetExpires
        }
    });

    await sendResetPasswordEmail(user, resetToken);

    res.json({
        success: true,
        status: 'success',
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé.'
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const { token, password, captchaToken } = req.body;

    // Vérification CAPTCHA
    if (!captchaToken) {
        return next(new AppError('Vérification CAPTCHA requise', 400));
    }

    const captchaVerification = await checkCaptcha(captchaToken);
    if (!captchaVerification.success) {
        return next(new AppError('CAPTCHA invalide', 400));
    }

    // Vérifier le token
    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
        include: { user: true }
    });

    if (!verificationToken || !verificationToken.user) {
        return next(new AppError("Token invalide ou expiré", 400));
    }

    const user = verificationToken.user;

    // Hasher le mot de passe
    const hash = await hashPassword(password);

    // Mettre à jour le mot de passe
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hash }
    });

    // Supprimer le token après utilisation (bonne pratique)
    await prisma.verificationToken.delete({ where: { token } });

    // ✅ Logger l'activité via le service
    await ActivityService.log(user.id, "PASSWORD_RESET", "Réinitialisation du mot de passe réussie", req);

    res.json({
        status: "success",
        message: "Mot de passe réinitialisé avec succès"
    });
});

exports.verifyEmailOTPCode = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError('Données invalides', 400, errors.array()));
    }

    const { email, code } = req.body;

    console.log(email)
    const now = new Date();

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return next(new AppError('Aucun utilisateur trouvé avec cet email', 404));
    if (!user.isActive) return next(new AppError('Ce compte a été désactivé', 401));
    if (user.emailVerified) return next(new AppError('Email déjà vérifié', 400));

    // Vérifier le code de vérification en premier
    const verificationCode = await prisma.verificationCode.findFirst({
        where: {
            email,
            code: parseInt(code),
            type: 'EMAIL_VERIFICATION',
            isUsed: false,
            expiresAt: { gt: now }
        }
    });

    if (!verificationCode) {
        // Incrémenter les tentatives pour tous les codes actifs
        await prisma.verificationCode.updateMany({
            where: {
                email,
                type: 'EMAIL_VERIFICATION',
                isUsed: false,
                expiresAt: { gt: now }
            },
            data: { attempts: { increment: 1 } }
        });

        // Vérifier le total des tentatives
        const recentCodes = await prisma.verificationCode.findMany({
            where: {
                email,
                type: 'EMAIL_VERIFICATION',
                createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            }
        });

        const totalAttempts = recentCodes.reduce((sum, c) => sum + c.attempts, 0);

        if (totalAttempts >= 10) {
            return next(new AppError('Trop de tentatives. Veuillez réessayer demain.', 429));
        }

        return next(new AppError('Code invalide ou expiré', 400));
    }

    // Vérifier si le nombre max de tentatives pour CE code est atteint
    if (verificationCode.attempts >= verificationCode.maxAttempts) {
        return next(new AppError('Trop de tentatives avec ce code. Veuillez demander un nouveau code.', 429));
    }

    // ✅ Marquer le code comme utilisé
    await prisma.verificationCode.update({
        where: { id: verificationCode.id },
        data: { isUsed: true, attempts: { increment: 1 } }
    });

    // ❌ Supprimer les autres codes uniquement après validation
    await prisma.verificationCode.deleteMany({
        where: {
            email,
            type: 'EMAIL_VERIFICATION',
            isUsed: false,
            id: { not: verificationCode.id }
        }
    });

    // ✅ Mettre à jour l’utilisateur
    await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true, updatedAt: new Date() }
    });

    await prisma.email.update({
        where: { email: email },
        data: { verified: true, verifiedAt: new Date() }
    });

    // Générer un token JWT
    const { accessToken } = await createTokens();

    res.status(200).json({
        success: true,
        status: 'success',
        message: 'Email vérifié avec succès',
        token: accessToken,
        user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            emailVerified: true,
            phoneVerified: user.phoneVerified
        },
        nextStep: user.phoneVerified ? 'signin' : 'verify-phone'
    });
});

exports.verifyPhoneOTPCode = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError('Données invalides', 400, errors.array()));
    }

    const { email, code } = req.body;
    const now = new Date();

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return next(new AppError('Aucun utilisateur trouvé avec cet email', 404));
    if (!user.isActive) return next(new AppError('Ce compte a été désactivé', 401));
    if (user.phoneVerified) return next(new AppError('Numéro de téléphone déjà vérifié', 400));

    const verificationCode = await prisma.verificationCode.findFirst({
        where: {
            userId: user.id,
            email,
            code: parseInt(code),
            type: 'PHONE_VERIFICATION',
            isUsed: false,
            expiresAt: { gt: now }
        }
    });

    if (!verificationCode) {
        return next(new AppError('Code invalide ou expiré', 400));
    }

    await prisma.verificationCode.update({
        where: { id: verificationCode.id },
        data: { isUsed: true, attempts: 1 }
    });

    await prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true }
    });

    res.status(200).json({
        success: true,
        message: 'Numéro de téléphone vérifié avec succès'
    });
});

exports.sendPhoneOTPCode = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError('Données invalides', 400, errors.array()));
    }

    const { email, phone } = req.body;

    console.log("email :", email, " phone :", phone);

    if (!email || !phone) {
        return next(new AppError('Email et numéro de téléphone requis', 400));
    }

    // 🔍 Vérifie si l’utilisateur existe
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email },
                { phone: phone }
            ]
        }
    });
    if (!user) return next(new AppError('Utilisateur introuvable', 404));
    if (!user.isActive) return next(new AppError('Ce compte a été désactivé', 403));

    // 🚫 Empêche l’envoi de code si déjà vérifié
    if (user.phoneVerified) {
        return next(new AppError('Le numéro est déjà vérifié', 400));
    }

    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 heures

    // ⏱️ Limiter le nombre d’envois de code par jour
    const codesSentToday = await prisma.verificationCode.count({
        where: {
            userId: user.id,
            email,
            type: 'PHONE_VERIFICATION',
            createdAt: { gte: new Date(Date.now() - expiry) },
        },
    });

    if (codesSentToday >= 5) {
        return next(new AppError('Trop de tentatives. Réessayez demain.', 429));
    }

    // 🔢 Génère le code OTP (6 chiffres)
    const code = await generateVerificationCode();

    // 🧾 Sauvegarde le code en base
    await prisma.verificationCode.create({
        data: {
            email,
            code: code,
            type: 'PHONE_VERIFICATION',
            isUsed: false,
            expiresAt: expiry,
            attempts: 1,
        }
    });

    // 📲 TODO: remplacer par Twilio / SMS provider
    console.log(`📱 Code OTP envoyé à ${phone}: ${code}`);

    await ActivityService.log(user.id, 'OTP_SEND', 'Envoi du code de vérification téléphonique', req);

    res.status(200).json({
        success: true,
        status: 'success',
        message: 'Code de vérification envoyé avec succès',
    });
});

