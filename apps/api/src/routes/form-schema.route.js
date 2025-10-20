const express = require('express');

const formSchemaController = require('../controllers/form-schema.controller');

const router = express.Router();

router.get('/:slug', formSchemaController.getFormBySlug);

module.exports = router;