const nodemailer = require('nodemailer');

exports.testConnection = async () => {
    try {
        console.log('🚀 === TEST DE CONNEXION SMTP ===\n');

        if (!process.env.SMTP_HOST || !process.env.SMTP_MAIL || !process.env.SMTP_PASS) {
            throw new Error('Configuration SMTP incomplète');
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASS
            },
            // Timeout pour éviter les blocages
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000
        });

        console.log('🔄 Test de connexion au serveur SMTP...');

        const verifyResult = await transporter.verify();
        console.log('✅ Connexion SMTP réussie!', verifyResult);

        return {
            success: true,
            result: verifyResult
        };
    } catch (error) {
        console.error('❌ Erreur de connexion SMTP:', error.message);

        // Diagnostic détaillé selon le type d'erreur
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Conseil: Le serveur SMTP est inaccessible. Vérifiez l\'hôte et le port.');
        } else if (error.code === 'EAUTH') {
            console.log('💡 Conseil: Erreur d\'authentification. Vérifiez l\'email et le mot de passe.');
        } else if (error.code === 'ETIMEDOUT') {
            console.log('💡 Conseil: Timeout de connexion. Vérifiez votre réseau.');
        }

        return {
            success: false,
            error: error.message
        };
    }
}