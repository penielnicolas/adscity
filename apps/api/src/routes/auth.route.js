const express = require('express');
const { validateMiddleware } = require('../middlewares/validate.middleware');
const { signupSchema, signinSchema } = require('../validations/schemas');
const authController = require('../controllers/auth.controller');
const { rateLimiter } = require('../middlewares/rate-limiter.middleware');
const { csrfDebug } = require('../middlewares/debug.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateCsrfToken } = require('../middlewares/csrf.middleware');

const router = express();

// Debug temporaire
router.use(csrfDebug);


// Routes protégées par CSRF
router.post(
    '/create-user',
    validateCsrfToken,
    rateLimiter,
    validateMiddleware(signupSchema),
    authController.createUser
);
router.post(
    '/signin',
    validateCsrfToken,
    rateLimiter,
    validateMiddleware(signinSchema),
    authController.signin
);
router.post(
    '/forgot-password',
    validateCsrfToken,
    rateLimiter,
    authController.forgotPassword
);
router.post('/email-code/verify', validateCsrfToken, authController.verifyEmailOTPCode);
router.post('/phone-code/verify', validateCsrfToken, authController.verifyPhoneOTPCode);
router.post('/otp-code/send', validateCsrfToken, authController.sendPhoneOTPCode);

// Routes sans CSRF (GET)
router.get(
    '/whoami',
    authenticate,
    authController.whoami
);

router.post(
    '/signout',
    authenticate,
    authController.signOut
);

module.exports = router;