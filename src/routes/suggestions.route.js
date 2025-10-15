const express = require('express');
const router = express.Router();
const suggestionsController = require('../controllers/suggestions.controller');

// GET /api/suggestions?q=kazaki
router.get('/', suggestionsController.getSuggestions);

module.exports = router;
