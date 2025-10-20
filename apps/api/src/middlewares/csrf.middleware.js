// middlewares/manualCsrf.middleware.js
const crypto = require('crypto');

let csrfTokens = new Map();

const generateCsrfToken = (req, res) => {
    const token = crypto.randomBytes(32).toString('hex');
    const sessionId = req.cookies?.sessionId || crypto.randomBytes(16).toString('hex');

    // Stocker le token
    csrfTokens.set(sessionId, token);

    // Set session cookie
    res.cookie('sessionId', sessionId, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        domain: 'localhost',
        path: '/',
        maxAge: 3600000
    });

    // Set CSRF token in response
    res.json({
        csrfToken: token,
        sessionId: sessionId,
        message: 'CSRF token generated successfully'
    });
};

const validateCsrfToken = (req, res, next) => {
    const sessionId = req.cookies?.sessionId;
    const clientToken = req.headers['x-csrf-token'] || req.headers['xsrf-token'] || req.headers['csrf-token'];

    console.log('🔐 Manual CSRF Validation:');
    console.log('- Session ID:', sessionId);
    console.log('- Client Token:', clientToken);
    console.log('- Stored Token:', sessionId ? csrfTokens.get(sessionId) : 'No session');

    if (!sessionId || !clientToken) {
        return res.status(403).json({
            success: false,
            message: 'CSRF token manquant'
        });
    }

    const storedToken = csrfTokens.get(sessionId);

    if (!storedToken || storedToken !== clientToken) {
        return res.status(403).json({
            success: false,
            message: 'CSRF token invalide'
        });
    }

    next();
};

module.exports = {
    generateCsrfToken,
    validateCsrfToken
};