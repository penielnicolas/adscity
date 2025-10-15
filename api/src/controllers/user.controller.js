const xss = require('xss');
const { prisma } = require("../config/db");
const ActivityService = require("../services/activity.service");
const { AppError } = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

exports.getUserById = catchAsync(async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(req.params.id) }
    });

    if (!user) {
        return next(new AppError('Aucun utilisateur trouvé', 400));
    }

    res.json(user);
});

exports.getUserPosts = catchAsync(async (req, res, next) => {
    const userId = parseInt(req.params.userId);

    if (userId !== req.user.id) {
        return next(new AppError('Accès refusé', 403));
    }
    const posts = await prisma.post.findMany({
        where: { userId: userId }
    });

    if (posts.length === 0) {
        return next(new AppError('Aucune annonce trouvée pour cet utilisateur', 400));
    }

    res.json(posts);
});


exports.updateProfile = catchAsync(async (req, res, next) => {
    const { field, value } = req.body;

    const userId = parseInt(req.params.id);
    console.log("User ID: ", userId);
    console.log("Current User ID: ", req.user.id);

    if (userId !== req.user.id) {
        return next(new AppError('Accès refusé', 403));
    }

    if (!["firstName", "lastName"].includes(field)) {
        return next(new AppError("Champ invalid", 400));
    }

    const safeValue = xss(value).trim(); // neutralise tout script

    const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { [field]: safeValue }
    });

    await ActivityService.log(updatedUser.id, 'PROFILE_UPDATE', "Profil mis à jour", req);

    res.json({
        success: true,
        message: "Profil mis à jour",
        user: updatedUser
    })
});