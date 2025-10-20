const express = require('express');
const { generateCsrfToken } = require('../middlewares/csrf.middleware');
const router = express.Router();

// Route pour obtenir le token CSRF (sans protection CSRF évidemment)
router.get('/token', generateCsrfToken);

module.exports = router;