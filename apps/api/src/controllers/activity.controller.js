const { prisma } = require("../config/db");
const { catchAsync } = require("../utils/catchAsync");

exports.getLogs = catchAsync(async (req, res) => {
    const { userId, action, startDate, endDate, page = 1, limit = 20 } = req.query;

    const filters = {};

    if (userId) filters.userId = userId;
    if (action) filters.action = action;
    if (startDate || endDate) {
        filters.createdAt = {};
        if (startDate) filters.createdAt.gte = new Date(startDate);
        if (endDate) filters.createdAt.lte = new Date(endDate);
    }

    const logs = await prisma.activityLog.findMany({
        where: filters,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { id: true, email: true, firstName: true, lastName: true }
            }
        }
    });

    const total = await prisma.activityLog.count({ where: filters });

    res.json({
        status: "success",
        results: logs.length,
        page: parseInt(page),
        total,
        data: logs
    });
});