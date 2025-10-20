const jwt = require('jsonwebtoken');
const { catchAsync } = require('../utils/catchAsync');
const { prisma } = require('../config/db');
const { AppError } = require('../utils/AppError');

const authenticate = catchAsync(async (req, res, next) => {
    const token = req.cookies['adscity.sid'];
    if (!token) return next(new AppError('Token manquant', 401));

    // Vérification de la session dans la base centrale
    const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
    });

    // Validation de la session
    if (!session || session.isRevoked || session.expiresAt < new Date()) {
        res.clearCookie('adscity.sid', {
            domain: process.env.NODE_ENV === 'production' ? '.adscity.net' : 'localhost',
            path: '/',
        });
        return next(new AppError('Session expirée ou invalide', 401));
    }

    // Vérification que le service actuel est autorisé
    const currentService = getServiceFromHost(req.headers.host);
    if (!session.services.includes(currentService)) {
        return next(new AppError('Service non autorisé', 403));
    }

    // Mise à jour de la dernière activité
    await prisma.session.update({
        where: { id: session.id },
        data: { lastActivity: new Date() },
    });

    req.user = session.user;
    req.session = session;
    next();
});


// Middleware pour vérifier les rôles spécifiques
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('Accès non autorisé pour ce rôle', 403));
        }
        next();
    };
};

const checkCaptcha = async (token) => {
    try {
        const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
        });

        const data = await response.json();

        console.log('Captcha verification response:', data);

        return {
            success: data.success,
            score: data.score, // Only available in v3
            action: data.action, // Only available in v3
            timestamp: data.challenge_ts,
            hostname: data.hostname
        };
    } catch (error) {
        console.error('Error verifying captcha:', error);
        return { success: false };
    }
}

// Helper pour identifier le service depuis l'host
const getServiceFromHost = (host) => {
    if (host.includes('auth.')) return 'auth';
    if (host.includes('id.')) return 'id';
    if (host.includes('admin.')) return 'admin';
    if (host.includes('dashboard.')) return 'dashboard';
    if (host.includes('help.')) return 'help';
    if (host.includes('pay.')) return 'pay';
    return 'app'; // domaine principal
}

module.exports = { authenticate, getServiceFromHost, requireRole, checkCaptcha };