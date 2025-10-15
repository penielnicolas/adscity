const { prisma } = require("../config/db");
const { AppError } = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");


// Actions sur les utilisateurs
exports.getUsers = catchAsync(async (req, res, next) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            createdAt: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            avatar: true,
            isActive: true
        },
        orderBy: { createdAt: 'asc' }
    })

    if (!users || users.length === 0) {
        return next(new AppError('Aucun utilisateur trouvé', 404));
    }

    res.json({
        success: true,
        data: users,
        count: users.length,
        message: 'Utilisateurs récupérés avec succès.'
    })
});

exports.getUserById = catchAsync(async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(req.params.id) }
    });

    if (!user) {
        return next(new AppError('Utilisateur pas trouvé', 404));
    }

    res.json({
        success: true,
        data: user,
        message: 'Utilisateur récupéré avec succès.'
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    // Interdiction de se supprimer soi-même
    if (req.user.id === parseInt(req.params.id)) {
        return next(new AppError('Vous ne pouvez pas supprimer votre propre compte.', 404));
    }

    const user = await prisma.user.findUnique({
        where: { id: parseInt(req.params.id) }
    });

    if (!user) {
        return next(new AppError('Utilisateur pas trouvé', 404));
    }

    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
});

exports.updateUserRole = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['ADMIN', 'MODERATOR', 'USER'];

    if (!validRoles.includes(role)) {
        return next(new AppError("Rôle invalide. Rôles autorisés : ADMIN, MODERATOR, USER", 400));
    }

    // Empêcher qu’un admin modifie son propre rôle
    if (req.user.id === id) {
        return next(new AppError("Vous ne pouvez pas modifier votre propre rôle.", 400));
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        return next(new AppError("Utilisateur introuvable", 404));
    }

    // Interdire modification du rôle d'un autre admin
    if (user.role === 'ADMIN') {
        return next(new AppError("Impossible de modifier le rôle d’un autre administrateur.", 403));
    }

    await prisma.user.update({
        where: { id },
        data: { role },
    });

    res.status(200).json({ message: `Rôle de l'utilisateur mis à jour en ${role}` });
});

exports.updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['ADMIN', 'MODERATOR', 'USER'];

    if (!validRoles.includes(role)) {
        return res.status(400).json({
            message: "Rôle invalide. Rôles autorisés : ADMIN, MODERATOR, USER"
        });
    }

    // Empêcher qu’un admin modifie son propre rôle
    if (req.user.id === id) {
        return res.status(400).json({
            message: "Vous ne pouvez pas modifier votre propre rôle."
        });
    }

    try {
        const targetUser = await prisma.user.findUnique({ where: { id } });

        if (!targetUser) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        // Interdire modification du rôle d'un autre admin
        if (targetUser.role === 'ADMIN') {
            return res.status(403).json({
                message: "Impossible de modifier le rôle d’un autre administrateur."
            });
        }

        await prisma.user.update({
            where: { id },
            data: { role },
        });

        res.status(200).json({ message: `Rôle de l'utilisateur mis à jour en ${role}` });
    } catch (error) {
        console.error('[UPDATE USER ROLE ERROR]', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.toggleUserActive = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Interdire à un admin de se bannir lui-même
    if (req.user.id === id) {
        return next(new AppError("Vous ne pouvez pas désactiver votre propre compte.", 400));
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        return next(new AppError("Utilisateur non trouvé.", 404));
    }

    // Interdire la désactivation d’un autre admin
    if (user.role === 'ADMIN') {
        return next(new AppError("Impossible de désactiver un administrateur..", 403));
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: { active: !user.isActive },
    });

    const status = updatedUser.isActive ? "activé" : "désactivé";
    res.json({ message: `Utilisateur ${status} avec succès.` });
});

exports.getUserLoginStats = catchAsync(async (req, res, next) => {

});

exports.getUsersCountries = catchAsync(async (req, res, next) => {
    const counties = [];

    const users = await prisma.user.findMany({
        select: { country: true }
    });

    users.forEach(user => {
        if (user.country && !counties.includes(user.country)) {
            counties.push(user.country);
        }
    });

    res.json({ counties });
});

exports.getUsersCities = catchAsync(async (req, res, next) => {
    const cities = [];

    const users = await prisma.user.findMany({
        select: { city: true }
    });

    users.forEach(user => {
        if (user.city && !cities.includes(user.city)) {
            cities.push(user.city);
        }
    });

    res.json({ cities });
});


// Actions sur les annonces
exports.getListings = catchAsync(async (req, res, next) => {
    const listings = await prisma.listing.findMany({
        select: {
            id: true,
            details: true,
            category: true,
            subcategory: true,
            images: true,
            status: true,
            isActive: true,
            location: true,
            createdAt: true,
            updatedAt: true,
            shopId: true,
            shop: true,
        },
        orderBy: { createdAt: 'desc' }
    });

    if (!listings || listings.length === 0) {
        return next(new AppError("Aucune annonce trouvée", 404))
    }

    const shopIds = [...new Set(listings.map(listing => listing.shopId))];

    const shops = await prisma.shop.findMany({
        where: {
            id: {
                in: shopIds
            }
        },
        select: {
            id: true,
            name: true,
            avatar: true,
            banner: true,
            description: true,
            category: true,
            slug: true,

        }
    });

    const shopMap = Object.fromEntries(shops.map(shop => [shop.id, shop]));

    const listingsWithStore = listings.map(listing => ({
        ...listing,
        shopId: shopMap[listing.shopId] || null
    }));

    res.status(200).json({
        success: true,
        data: listingsWithStore,
        message: 'Listings récupérés avec succès.'
    });
});

exports.getListingById = catchAsync(async (req, res, next) => {
    const listing = await prisma.listing.findUnique({
        where: { id: parseInt(req.params.id) },
        select: {
            id: true,
            details: true,
            category: true,
            subcategory: true,
            location: true,
            images: true,
            audience: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            }
        }
    });

    if (!listing) {
        return next(new AppError("Annonce non trouvée", 404));
    }

    res.status(200).json({
        data: listing,
        message: 'Annonce récupérée avec succès.'
    });
});

exports.deleteListing = catchAsync(async (req, res, next) => {
    const listing = await prisma.listing.findUnique({
        where: { id: parseInt(req.params.id) }
    });

    if (!listing) {
        return next(new AppError("Annonce non trouvée", 404))
    }

    await prisma.listing.delete({
        where: { id: parseInt(req.params.id) }
    });

    res.status(200).json({ message: 'Annonce supprimée avec succès.' });
});

exports.toggleListingActive = catchAsync(async (req, res, next) => {
    const listing = await prisma.listing.findUnique({
        where: { id: parseInt(req.params.id) },
        select: { id: true, title: true, isActive: true, status: true }
    });

    if (!listing) {
        return next(new AppError("Annonce non trouvée", 404))
    }

    // Vérifier que l'annonce peut être activée/désactivée
    if (listing.status === 'DELETED' || listing.status === 'REJECTED') {
        return next(new AppError("Impossible de modifier une annonce supprimée ou rejetée", 400))
    }

    const updatedListing = await prisma.listing.update({
        where: { id: parseInt(req.params.id) },
        data: { isActive: !listing.isActive }
    });

    res.status(200).json({
        success: true,
        message: `Annonce ${updatedListing.isActive ? 'activée' : 'désactivée'} avec succès.`
    });
});

exports.approveListing = catchAsync(async (req, res) => {
    // Vérifier si l'annonce existe 
    const listing = await prisma.listing.findUnique({
        where: { id: parseInt(req.params.id) }
    });

    if (!listing) {
        return next(new AppError('Annonce non trouvée.', 404));
    }

    // Changer le statut de l'annonce en "APPROVED"
    await prisma.listing.update({
        where: { id: parseInt(req.params.id) },
        data: { status: 'APPROVED' }
    });

    // Récupérer le magasin associé à l'annonce
    const store = await prisma.shop.findUnique({
        where: {
            id: listing.storeId
        }
    });

    if (!store) {
        return next(new AppError('Magasin non trouvé.', 404));
    }

    res.status(200).json({ message: 'Annonce approuvée avec succès.' });
});

exports.rejectListing = catchAsync(async (req, res, next) => {
    const listing = await prisma.listing.findUnique({
        where: { id: parseInt(req.params.id) }
    });

    if (!listing) {
        return next(new AppError('Annonce non trouvée.', 404));
    }

    await prisma.listing.update({
        where: { id: parseInt(req.params.id) },
        data: { status: 'REJECTED' }
    });

    res.status(200).json({ message: 'Annonce rejetée avec succès.' });
});


exports.listTickets = catchAsync(async (req, res, next) => {
    const user = req.user;
    const { page = 1, perPage = 20, status, q, category, priority } = req.query;
    const take = Math.min(Number(perPage) || 20, 100);
    const skip = (Number(page) - 1) * take;

    const where = {};

    // If not support/admin, show only user's tickets
    if (!req.user?.roles?.includes('SUPPORT') && !req.user?.roles?.includes('ADMIN')) {
        where.userId = user?.id || null;
    } else {
        // admin can filter across all users
        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (category) where.category = category;
    }

    if (q) {
        where.OR = [
            { subject: { contains: q, mode: 'insensitive' } },
            { reference: { contains: q } }
        ];
    }

    const [tickets, total] = await prisma.$transaction([
        prisma.ticket.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
            take,
            skip,
            include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } }
        }),
        prisma.ticket.count({ where })
    ]);

    res.json({ success: true, data: tickets, meta: { total, page: Number(page), perPage: take } });
});

exports.updateTicket = catchAsync(async (req, res, next) => { });

exports.getReports = catchAsync(async (req, res, next) => {
    const reports = await prisma.postReport.findMany({
        include: { post: true, user: true }
    });
    res.json({ success: true, data: reports });
});

exports.getReportById = catchAsync(async (req, res, next) => {
    const reportId = req.params.id;

    const report = await prisma.postReport.findUnique({
        where: { id: reportId },
        include: { post: true, user: true }
    });

    if (!report) {
        return next(new AppError("Report not found", 404));
    }

    res.json({ success: true, data: report });
});

exports.deleteReport = catchAsync(async (req, res, next) => {
    const reportId = req.params.id;

    const report = await prisma.postReport.findUnique({
        where: { id: reportId },
    });

    if (!report) {
        return next(new AppError("Report not found", 404));
    }

    await prisma.postReport.delete({ where: { id: reportId } });
    res.json({ success: true, message: "Report deleted" });
});