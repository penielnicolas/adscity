const express = require('express');
const csrf = require('csurf');
const { validateMiddleware } = require('../middlewares/validate.middleware');
const { signupSchema, signinSchema } = require('../validations/schemas');
const authController = require('../controllers/auth.controller');
const { rateLimiter } = require('../middlewares/rate-limiter.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express();

// ⚔️ Protection CSRF
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // true si HTTPS
        domain: ".adscity.net",
    },
});

router.get(
    '/whoami',
    authenticate,
    authController.whoami
);
router.post(
    '/create-user',
    csrfProtection,
    rateLimiter,
    validateMiddleware(signupSchema),
    authController.createUser
);
router.post(
    '/signin',
    csrfProtection,
    rateLimiter,
    validateMiddleware(signinSchema),
    authController.signin
);
router.post(
    '/forgot-password',
    csrfProtection,
    rateLimiter,
    authController.forgotPassword
);
router.post('/signout', authenticate, csrfProtection, authController.signOut);
router.post('/email-code/verify', csrfProtection, authController.verifyEmailOTPCode);
router.post('/phone-code/verify', csrfProtection, authController.verifyPhoneOTPCode);
router.post('/otp-code/send', csrfProtection, authController.sendPhoneOTPCode);

module.exports = router;