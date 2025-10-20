const nodemailer = require('nodemailer');

// Configuration du transporteur email
const createTransporter = async () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASS
        }
    });
};

exports.sendEmail = async (options) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: options.from || process.env.SMTP_MAIL, // Fallback
            to: options.to || options.email, // Support les deux formats
            subject: options.subject,
            text: options.text,
            html: options.html
        };

        // Validation
        if (!mailOptions.to) {
            throw new Error('Aucun destinataire défini');
        }

        console.log('📧 Tentative d\'envoi à:', mailOptions.to);

        const result = await transporter.sendMail(mailOptions);
        console.log("✅ Email envoyé avec succès. Message ID:", result.messageId);

        return result;
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi de l'email:", error.message);
        throw error;
    }
};