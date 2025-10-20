const express = require('express');
const router = express.Router();

const notifyController = require('../controllers/notify.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/preferences/:userId', authenticate, notifyController.getUserPreferences);
router.put("/preferences/:userId", authenticate, notifyController.updateUserPreferences);

module.exports = router;