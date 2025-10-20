const { prisma } = require("../config/db");

class SystemLogger {
    /**
  * Crée un log système
  * @param {string} action - Type d'action (ex: CLEANUP_VERIFICATION_CODES, BACKUP_DB, etc.)
  * @param {string|object|null} details - Message ou objet contenant les détails
  * @param {'INFO'|'WARNING'|'ERROR'|'CRITICAL'} level - Niveau du log
  */

    static async log(action, details = null, level = 'INFO') {
        try {
            let message = typeof details === 'object' ? JSON.stringify(details) : details;

            await prisma.systemLog.create({
                data: {
                    action,
                    details: message,
                    level,
                },
            });

            console.log(`🧾 [${level}] ${action}: ${message || ''}`);
        } catch (error) {
            console.error('❌ Erreur lors de la création du log système:', error.message);
        }
    }

    /**
   * Raccourcis pratiques
   */
    static async info(action, details) {
        return this.log(action, details, 'INFO');
    }

    static async warn(action, details) {
        return this.log(action, details, 'WARNING');
    }

    static async error(action, details) {
        return this.log(action, details, 'ERROR');
    }

    static async critical(action, details) {
        return this.log(action, details, 'CRITICAL');
    }
};

module.exports = SystemLogger;