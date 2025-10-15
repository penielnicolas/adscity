const cron = require('node-cron');
const { prisma } = require("../config/db");
const SystemLogger = require("../utils/SystemLogger");
const { sendInactivityWarning } = require('../services/email.service');

exports.deactivateInactiveUsers = async () => {
    // 🔁 Tous les jours à 03h00 du matin
    cron.schedule('0 3 * * *', async () => {
        console.log('🕒 [CRON] Lancement du nettoyage automatique des comptes inactifs...');

        const now = new Date();
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(now.getMonth() - 6);

        const fiveAndHalfMonthsAgo = new Date(now);
        fiveAndHalfMonthsAgo.setMonth(now.getMonth() - 5);
        fiveAndHalfMonthsAgo.setDate(fiveAndHalfMonthsAgo.getDate() - 15);

        try {
            // 📨 Étape 1 : Avertir les utilisateurs inactifs depuis 5 mois et demi
            const usersToWarn = await prisma.user.findMany({
                where: {
                    isActive: true,
                    warnedBeforeDeactivation: false,
                    OR: [
                        { lastLogin: { lt: fiveAndHalfMonthsAgo } },
                        { lastLogin: null, createdAt: { lt: fiveAndHalfMonthsAgo } },
                    ],
                },
                select: { id: true, email: true, firstName: true, lastName: true },
            });

            for (const user of usersToWarn) {
                await sendInactivityWarning(user);
                await prisma.user.update({
                    where: { id: user.id },
                    data: { warnedBeforeDeactivation: true },
                });
            }

            if (usersToWarn.length > 0) {
                await SystemLogger.info('INACTIVITY_WARNING_SENT', `${usersToWarn.length} utilisateurs avertis`);
                console.log(`📩 ${usersToWarn.length} avertissements envoyés`);
            }

            // 🚫 Étape 2 : Désactiver les utilisateurs inactifs depuis plus de 6 mois
            const usersToDeactivate = await prisma.user.findMany({
                where: {
                    isActive: true,
                    OR: [
                        { lastLogin: { lt: sixMonthsAgo } },
                        { lastLogin: null, createdAt: { lt: sixMonthsAgo } },
                    ],
                },
                select: { id: true, email: true },
            });

            if (usersToDeactivate.length > 0) {
                const { count } = await prisma.user.updateMany({
                    where: { id: { in: usersToDeactivate.map(u => u.id) } },
                    data: { isActive: false },
                });

                await SystemLogger.warn('DEACTIVATE_INACTIVE_USERS', {
                    totalDeactivated: count,
                    emails: usersToDeactivate.map(u => u.email),
                });

                console.log(`✅ ${count} utilisateurs désactivés.`);
            }
        } catch (error) {
            await SystemLogger.error('CRON_ERROR', error.message);
            console.error('❌ Erreur CRON:', error);
        }
    });
};