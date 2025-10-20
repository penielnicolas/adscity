
export function formattedDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        // hour: '2-digit',
        // minute: '2-digit',
    });
};

export function formatJoinDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
    });
}

export function formatSmartDate(isoDateStr) {
    const date = new Date(isoDateStr);
    const now = new Date();

    const pad = (n) => (n < 10 ? '0' + n : n);

    const timePart = `${pad(date.getHours())}h${pad(date.getMinutes())}`;

    // Obtenir les dates normalisées à minuit pour comparaison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = nowOnly - dateOnly;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return `Aujourd'hui à ${timePart}`;
    if (diffDays === 1) return `Hier à ${timePart}`;
    if (diffDays === 2) return `Avant-hier à ${timePart}`;

    // Sinon : format complet
    const fullDate = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
    return `${fullDate} à ${timePart}`;
}

export function formatNumber(n) {
    if (n >= 1_000_000) {
        return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' M';
    }
    if (n >= 1_000) {
        return (n / 1_000).toFixed(1).replace(/\.0$/, '') + ' k';
    }
    return n.toString();
}
