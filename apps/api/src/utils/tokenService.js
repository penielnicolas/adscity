const jwt = require('jsonwebtoken');

const createTokens = (userId, rememberMe) => {
    // Si rememberMe est true, le token d'accès dure plus longtemps
    // mais le refresh token reste le même
    let expiresIn = rememberMe ? '7d' : (process.env.JWT_EXPIRES_IN || '15m');
    
    const accessToken = jwt.sign(
        { userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: expiresIn }
    );

    const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
        return null;
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = {
    createTokens,
    verifyAccessToken,
    verifyRefreshToken
};