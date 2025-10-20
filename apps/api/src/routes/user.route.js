const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();

// Private routes
router.get('/:userId/posts', authenticate, userController.getUserPosts);
router.patch('/:userId/profile', authenticate, userController.updateProfile);


// Public routes
router.get('/id', userController.getUserById);



module.exports = router;