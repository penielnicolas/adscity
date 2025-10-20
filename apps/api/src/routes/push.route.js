const express = require('express');
const webpush = require('web-push');
const router = express.Router();

const pushController = require('../controllers/push.controller');

// ✅ VAPID keys (utilise celles générées avant)
webpush.setVapidDetails(
    'mailto:support@adscity.net',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Route pour enregistrer la subscription
router.post('/subscribe', pushController.subscribe);

// Déclencher une notification manuellement (ex: test)
router.post("/notify", pushController.notify);

module.exports = router;