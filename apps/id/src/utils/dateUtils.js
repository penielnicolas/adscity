// utils/dateUtils.js

/**
 * Convertit un timestamp ISO en date lisible en français
 * Exemple : "2025-09-15T08:52:46.303Z" -> "15 septembre 2025"
 */
export function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Retourne une distance relative (plus naturelle en français)
 * Exemple : "aujourd’hui", "hier", "dans 2 jours", "il y a 3 heures"
 */
export function timeAgo(isoString) {
    const date = new Date(isoString);
    const now = new Date();

    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // ✅ gestion spéciale pour aujourd’hui, hier, demain
    if (diffDays === 0) return "aujourd’hui";
    if (diffDays === -1) return "hier";
    if (diffDays === 1) return "demain";

    // Sinon, on bascule sur RelativeTimeFormat
    const diffInSeconds = Math.round(diffMs / 1000);
    const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });

    const divisions = [
        { amount: 60, unit: 'second' },
        { amount: 60, unit: 'minute' },
        { amount: 24, unit: 'hour' },
        { amount: 30, unit: 'day' },
        { amount: 12, unit: 'month' },
        { amount: Number.POSITIVE_INFINITY, unit: 'year' },
    ];

    let duration = diffInSeconds;
    for (let i = 0; i < divisions.length; i++) {
        const division = divisions[i];
        if (Math.abs(duration) < division.amount) {
            return rtf.format(duration, division.unit);
        }
        duration = Math.floor(duration / division.amount);
    }
}
