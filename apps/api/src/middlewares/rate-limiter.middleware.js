const rateLimit = require('express-rate-limit');

// Rate limiter général
const rateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes par défaut
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limite de 100 requêtes par IP par fenêtre
    message: {
        status: 'error',
        message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting pour les requêtes en développement si nécessaire
        return process.env.NODE_ENV === 'development' && req.ip === '::1';
    }
});

// Rate limiter strict pour l'authentification
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives de connexion par IP
    message: {
        status: 'error',
        message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Rate limiter pour les uploads
const uploadLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 20, // 20 uploads par IP
    message: {
        status: 'error',
        message: 'Trop d\'uploads. Réessayez dans 10 minutes.'
    }
});

// Rate limiter pour les posts
const postLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 50, // 50 posts par heure
    message: {
        status: 'error',
        message: 'Limite de publications atteinte. Réessayez dans une heure.'
    }
});

// Rate limiter pour les rapports
const reportLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 20, // 20 rapports par heure
    message: {
        status: 'error',
        message: 'Limite de rapports atteinte. Réessayez dans une heure.'
    }
});

module.exports = {
    rateLimiter,
    authLimiter,
    uploadLimiter,
    postLimiter,
    reportLimiter
};