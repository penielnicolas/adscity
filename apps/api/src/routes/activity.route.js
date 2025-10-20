const express = require('express');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');
const activityController = require('../controllers/activity.controller');

const router = express.Router();

// 🔒 Seulement accessible par admin
router.get('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), activityController.getLogs);

module.exports = router;