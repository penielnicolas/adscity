const cron = require('node-cron');
const { prisma } = require("../config/db");
const SystemLogger = require('../utils/SystemLogger');

// 0 * * * * → exécution chaque heure pile.
// 0 0 * * * → chaque jour à minuit.
// */30 * * * * → toutes les 30 minutes.

exports.cleanupVerificationCodes = async () => {
    cron.schedule('0 0 * * *', async () => { // chaque jour à minuit

        try {
            console.log('🕒 [CRON] Lancement du nettoyage automatique des codes de vérification...');
            const now = new Date();

            // Suppression des codes expirés ou déjà utilisés
            const deleted = await prisma.verificationCode.deleteMany({
                where: {
                    OR: [
                        { isUsed: true },
                        { expiresAt: { lt: now } }
                    ]
                }
            });

            // 🔍 Ajout du log système
            await SystemLogger.info('CLEANUP_VERIFICATION_CODES', `${deleted.count} codes supprimés`);
        } catch (error) {
            console.error('Erreur lors du nettoyage des codes :', error);

            // Log en cas d’erreur
            await SystemLogger.error('CLEANUP_VERIFICATION_CODES', error.message);
        }
    });
};