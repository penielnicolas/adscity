const ejs = require('ejs');
const path = require('path');
const { sendEmail } = require('../utils/mailer');

// Envoi de l’email de vérification
const sendVerificationEmail = async (user, code) => {
    const templatePath = path.join(
        __dirname,
        "../templates/verify-email.ejs"
    );

    // Rendu EJS → HTML
    const html = await ejs.renderFile(templatePath, {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        code,
        year: new Date().getFullYear(),
    });

    await sendEmail({
        from: `"AdsCity Security" <${process.env.SMTP_MAIL}>`,
        email: user.email,
        subject: "Vérifiez votre adresse email - AdsCity",
        html: html,
    });
};

// Envoi de l'email de réinitialisation de mot de passe
const sendResetPasswordEmail = async (user, token) => {
    const resetUrl = `${process.env.AUTH_URL || "http://localhost:3001"
        }/reset-password/${token}`;

    const templatePath = path.join(
        __dirname,
        "../templates/reset-password.ejs"
    );

    const expirationDelay = 1; // en heure

    // Rendu EJS → HTML
    const html = await ejs.renderFile(templatePath, {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        resetUrl,
        expirationTime: expirationDelay,
        year: new Date().getFullYear(),
    });

    await sendEmail({
        email: user.email,
        subject: 'Réinitialisation de votre mot de passe - AdsCity',
        html: html
    });
};

// Envoi de l'email de l’avertissement et la désactivation automatique
const sendInactivityWarning = async (user) => {
    const templatePath = path.join(
        __dirname,
        "../templates/send-inactivity-warning.ejs"
    );

    // Rendu EJS → HTML
    const html = await ejs.renderFile(templatePath, {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        year: new Date().getFullYear(),
    });

    await sendEmail({
        from: `"AdsCity Accounts" <${process.env.SMTP_MAIL}>`,
        email: user.email,
        subject: "⚠️ Votre compte AdsCity sera bientôt désactivé",
        html: html,
    });
};

module.exports = {
    sendInactivityWarning,
    sendVerificationEmail,
    sendResetPasswordEmail,
};