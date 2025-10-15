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
    const transporter = await createTransporter();

    const mailOptions = {
        from: options.from,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("📧 Email envoyé avec succès à:", options.email);
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi de l'email:", error);
        throw new Error("Erreur lors de l'envoi de l'email");
    }
};