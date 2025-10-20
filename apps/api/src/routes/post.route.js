const express = require('express');
const postController = require('../controllers/post.controller');
const { postLimiter } = require('../middlewares/rate-limiter.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post(
    '/create',
    authenticate,
    postLimiter,
    postController.createPost
);
router.get('/:id', postController.getPostById);
router.put(
    '/:id', 
    authenticate,
    postController.updatePost
);
router.delete(
    '/:id',
    authenticate,
    postController.deletePost
);
router.get('/', postController.listPosts);

module.exports = router;