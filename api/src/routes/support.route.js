const express = require('express');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');
const { rateLimiter } = require('../middlewares/rate-limiter.middleware');
const { validateMiddleware } = require('../middlewares/validate.middleware');
const { createTicketSchema, createMessageSchema } = require('../validations/schemas');

const supportController = require('../controllers/support.controller');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.post('/tickets', authenticate, requireRole('USER'), rateLimiter, upload.array('attachments', 6), validateMiddleware(createTicketSchema), supportController.createTicket);
router.get('/tickets/:id', authenticate, rateLimiter, supportController.getTicket);
router.post('/tickets/:id/messages', authenticate, rateLimiter, upload.array('attachments', 6), validateMiddleware(createMessageSchema), supportController.addMessage);
router.post('/tickets/:id/close', authenticate, rateLimiter, supportController.closeTicket);

module.exports = router;