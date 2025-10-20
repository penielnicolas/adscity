const { prisma } = require("../config/db");
const { AppError } = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

exports.getUserPreferences = catchAsync(async (req, res, next) => {
    const userId = req.params.userId;

    if (userId !== req.user.id) {
        return next(new AppError("Vous n'êtes pas autorisé à accéder à ces préférences.", 403));
    }

    const prefs = await prisma.notificationPreference.findMany({
        where: { userId: userId },
    });

    res.status(200).json({ preferences: prefs });
});

exports.updateUserPreferences = catchAsync(async (req, res, next) => {
    const userId = req.params.userId;
    const { preferences } = req.body;

    for (const [type, channels] of Object.entries(preferences)) {
        await prisma.notificationPreference.upsert({
            where: { userId_type: { userId: userId, type: type } },
            update: { channels: channels },
            create: { userId: userId, type: type, channels: channels },
        });
    }

    res.status(200).json({ success: true, message: "Préférences mises à jour avec succès." });
});