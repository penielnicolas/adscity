const express = require('express');

const bankController = require('../controllers/bank.controller');

const router = express.Router();

router.get('/', bankController.getBankLogos);

module.exports = router;