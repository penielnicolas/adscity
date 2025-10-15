const { prisma } = require("../config/db");

class ActivityService {
    /**
     * Enregistre un log d'activité et analyse son niveau de risque
     * @param {string} userId - ID de l'utilisateur concerné
     * @param {string} action - Type d'action (ex: SIGNIN, SIGNUP, PASSWORD_RESET, etc.)
     * @param {string} description - Description lisible de l'activité
     * @param {object} req - Objet `request` Express (pour ip & userAgent)
     */
    static async log(userId, action, description, req = null) {
        try {
            const ip = req ? req.ip : null;
            const userAgent = req ? req.headers["user-agent"] : null;

            // Étape 1 : Créer le log
            const log = await prisma.activityLog.create({
                data: {
                    userId,
                    action,
                    description,
                    ipAddress: ip,
                    userAgent
                }
            });

            // Étape 2 : Analyser le risque
            const analysis = await this.analyzeSuspiciousActivity(userId, { ip, userAgent, action });

            if (analysis.risk !== "low") {
                // Étape 3 : Marquer le log comme suspect
                await prisma.activityLog.update({
                    where: { id: log.id },
                    data: {
                        riskLevel: analysis.risk,
                        riskReason: analysis.reason
                    }
                });

                // Étape 4 (optionnel) : Déclencher une alerte / email
                console.warn(`⚠️ Activité suspecte détectée pour l'utilisateur ${userId} :`, analysis);
            }

        } catch (error) {
            console.error("Erreur lors de la création ou de l'analyse du log :", error.message);
        }
    }

    /**
     * Analyse le niveau de risque d'une activité utilisateur
     * @param {string} userId - ID utilisateur
     * @param {object} context - Contexte de l'activité (ip, userAgent, action)
     * @returns {Promise<{ risk: "low" | "medium" | "high", reason: string }>}
     */
    static async analyzeSuspiciousActivity(userId, context) {
        const { ip, userAgent, action } = context;

        let risk = "low";
        let reason = "Activité normale";

        try {
            // 📌 Récupérer les logs récents de cet utilisateur
            const recentLogs = await prisma.activityLog.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 5
            });

            // --- Vérification 1 : IP / localisation ---
            if (ip) {
                const currentGeo = await this.getGeoLocation(ip);

                if (recentLogs.length > 0) {
                    const lastLog = recentLogs[0];
                    if (lastLog.ipAddress && lastLog.ipAddress !== ip) {
                        const lastGeo = await this.getGeoLocation(lastLog.ipAddress);
                        if (lastGeo.country !== currentGeo.country) {
                            risk = "high";
                            reason = `Connexion depuis un pays différent (${lastGeo.country} → ${currentGeo.country})`;
                        } else if (lastGeo.region !== currentGeo.region) {
                            risk = "medium";
                            reason = `Connexion depuis une région différente (${lastGeo.region} → ${currentGeo.region})`;
                        }
                    }
                }
            }

            // --- Vérification 2 : User-Agent ---
            if (recentLogs.length > 0 && userAgent) {
                const lastLog = recentLogs[0];
                if (lastLog.userAgent && lastLog.userAgent !== userAgent) {
                    risk = risk === "high" ? "high" : "medium";
                    reason = "Nouvel appareil ou navigateur détecté";
                }
            }

            // --- Vérification 3 : Activité sensible ---
            if (["PASSWORD_RESET", "EMAIL_CHANGE"].includes(action)) {
                if (risk === "low") {
                    risk = "medium";
                    reason = "Action sensible détectée";
                }
            }
        } catch (error) {
            console.error("Erreur lors de l'analyse de l'activité suspecte :", error.message);
        }

        return { risk, reason };
    }

    static async getGeoLocation(ip) {
        try {
            const response = await fetch(`https://ipwho.is/${ip}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Vérifie si la requête est un succès
            if (!result.success) {
                console.warn("IP lookup failed:", result.message || result);
                return null;
            }

            console.log("Data from ipwho.is:", result);

            return {
                city: result.city,
                region: result.region,
                country: result.country,
                continent: result.continent,
            };
        } catch (error) {
            console.error("Erreur lors de la récupération de la localisation :", error);
            return null;
        }
    }
}

module.exports = ActivityService;