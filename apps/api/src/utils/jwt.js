const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require("crypto");

// Durées de vie
const ACCESS_TOKEN_EXP = "15m";
const REFRESH_TOKEN_EXP = "7d";

exports.generateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: ACCESS_TOKEN_EXP }
    );

    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXP }
    );

    return { accessToken, refreshToken };
};

exports.generateVerificationCode = async () => {
    return Math.floor(100000 + Math.random() * 900000);
}

exports.generateVerificationToken = async () => {
    return crypto.randomBytes(32).toString('hex');
}

exports.hashPassword = async (password) => {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    return await bcrypt.hash(password, saltRounds);
};

exports.comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}