import { formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";

// Custom locales
const customLocales = {
    fr: {
        ...fr,
        formatDistance: (token, count, options) => {
            let result = fr.formatDistance(token, count, options);
            return result
                .replace("environ ", "")   // supprime "environ"
                .replace("moins de ", "< ") // raccourci
                .replace(" minutes", "min") // abréviation
                .replace(" heures", "h")   // abréviation
                .replace(" jours", "j");   // abréviation
        },
    },
    en: {
        ...enUS,
        formatDistance: (token, count, options) => {
            let result = enUS.formatDistance(token, count, options);
            return result
                .replace("about ", "")  // supprime "about"
                .replace("less than a minute", "<1m")
                .replace(" minutes", "m")
                .replace(" hours", "h")
                .replace(" days", "d");
        },
    },
};

/**
 * Format a date as "time ago"
 * @param {Date | string | number} date
 * @param {Object} options
 * @param {string} options.locale - 'fr' or 'en'
 * @param {boolean} options.addSuffix - show "il y a / ago"
 */
export function timeAgo(date, { locale = "fr", addSuffix = true } = {}) {
    if (!date) return "";

    return formatDistanceToNow(new Date(date), {
        addSuffix,
        locale: customLocales[locale] || customLocales.fr,
    });
}