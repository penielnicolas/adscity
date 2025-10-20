const { catchAsync } = require("../utils/catchAsync");

const PushNotification = require('../services/push-notification.service');
const { prisma } = require("../config/db");
const { AppError } = require("../utils/AppError");

exports.createPost = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    // Vérifier si l'utilisateur est désactivé
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isActive: true }
    });

    if (!user || !user.isActive) {
        return next(new AppError("User is deactivated", 403));
    }

    // Vérifier si l'utilisateur a atteint la limite d'annonces
    const postCount = await prisma.post.count({
        where: { authorId: userId }
    });

    if (postCount >= 5) {
        return next(new AppError("Post limit reached", 403));
    }

    // Logic to create a post
    const {details, location, images, category, subcategory, audience, visibility } = req.body;
    const post = { details, location, images, category, subcategory, audience };

    // Envoyer une notification push pour la nouvelle annonce
    const notificationPayload = PushNotification.createPostNotification(post);
    await PushNotification.sendNotification(notificationPayload);
    res.status(201).json({ success: true, message: "Post created" });
});

exports.getPostById = catchAsync(async (req, res, next) => {
    const postId = req.params.id;

    // Vérifier si l'annonce existe
    const post = await prisma.post.findUnique({
        where: { id: postId },
    });

    if (!post) {
        return next(new AppError("Post not found", 404));
    }

    res.json({ success: true, data: post });
});

exports.updatePost = catchAsync(async (req, res, next) => {
    // Logic to update a post
    res.json({ success: true, message: "Post updated" });
});

exports.deletePost = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const postId = req.params.id;

    // Vérifier si l'annonce appartient à l'utilisateur
    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true }
    });

    if (!post) {
        return next(new AppError("Post not found", 404));
    }

    if (post.authorId !== userId) {
        return next(new AppError("Unauthorized", 403));
    }

    await prisma.post.delete({ where: { id: postId } });
    res.json({ success: true, message: "Post deleted" });
});     

exports.listPosts = catchAsync(async (req, res, next) => {
    // Logic to list all posts
    const posts = await prisma.post.findMany({
        where: { createdAt: { lt: new Date() } },
        select: {
            id: true,
            audience: true,
            author: true,
            images: true,
            details: true,
            location: true,
            views: true,
            visibility: true,
        }
    });

    if (posts.length === 0) {}
    res.json([{ id: 1, title: "Sample Post" }]);
});

