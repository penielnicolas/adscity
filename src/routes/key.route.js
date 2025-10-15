const express = require('express');
const router = express.Router();
const keyController = require('../controllers/key.controller');

router.get('/generate', keyController.generateKeys);


module.exports = router;