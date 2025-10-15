const { prisma } = require("../config/db");
const { catchAsync } = require("../utils/catchAsync");

exports.createReport = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { postId, reason } = req.body;

    if (!postId || !reason) {
        return next(new AppError("postId and reason are required", 400));
    }

    // Vérifier si l'annonce existe
    const post = await prisma.post.findUnique({
        where: { id: postId },
    });

    if (!post) {
        return next(new AppError("Post not found", 404));
    }

    // Empêche les doublons côté base
    const existingReport = await prisma.postReport.findFirst({
        where: { userId, postId }
    });

    if (existingReport) {
        return next(new AppError("You have already reported this post", 400));
    }

    // Créer le signalement
    const report = await prisma.postReport.create({
        data: {
            userId,
            postId,
            reason
        }
    });

    res.status(201).json({ success: true, data: report });
});

// exports.getReports = catchAsync(async (req, res, next) => {
//     const userId = req.user.id;
//     // Vérifier si l'utilisateur est admin
//     const user = await prisma.user.findUnique({
//         where: { id: userId },
//     });

//     if (!user || !['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(user.role)) {
//         return next(new AppError("Unauthorized", 403));
//     }

//     const reports = await prisma.postReport.findMany({
//         include: { post: true, user: true }
//     });
//     res.json({ success: true, data: reports });
// });

// exports.getReportById = catchAsync(async (req, res, next) => { 
//     const userId = req.user.id;
//     const reportId = req.params.id;

//     // Vérifier si l'utilisateur est admin
//     const user = await prisma.user.findUnique({
//         where: { id: userId },
//     });

//     if (!user || !['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(user.role)) {
//         return next(new AppError("Unauthorized", 403));
//     }

//     const report = await prisma.postReport.findUnique({
//         where: { id: reportId },
//         include: { post: true, user: true }
//     });

//     if (!report) {
//         return next(new AppError("Report not found", 404));
//     }

//     res.json({ success: true, data: report });
// });

// exports.deleteReport = catchAsync(async (req, res, next) => { 
//     const userId = req.user.id;
//     const reportId = req.params.id;

//     // Vérifier si l'utilisateur est admin
//     const user = await prisma.user.findUnique({
//         where: { id: userId },
//     });

//     if (!user || !['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(user.role)) {
//         return next(new AppError("Unauthorized", 403));
//     }

//     const report = await prisma.postReport.findUnique({
//         where: { id: reportId },
//     });

//     if (!report) {
//         return next(new AppError("Report not found", 404));
//     }

//     await prisma.postReport.delete({ where: { id: reportId } });
//     res.json({ success: true, message: "Report deleted" });
// });