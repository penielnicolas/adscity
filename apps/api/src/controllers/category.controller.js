const path = require('path');
const fs = require('fs').promises;

const { catchAsync } = require("../utils/catchAsync");
const { prisma } = require('../config/db');
const { AppError } = require('../utils/AppError');

exports.getCategories = catchAsync(async (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const categories = await prisma.postCategory.findMany({
        where: { parentId: null },
        include: { children: true },
        orderBy: { name: 'asc' }
    });

    const categoriesWithImages = categories.map(category => {
        // Format les enfants avec image complète
        const formattedChildren = category.children.map(child => ({
            ...child,
            image: child.image
                ? `${baseUrl}/public/images/categories/${category.slug}/${child.image}`
                : null
        }));

        return {
            ...category,
            image: category.image
                ? `${baseUrl}/public/images/categories/${category.slug}/${category.image}`
                : null,
            children: formattedChildren
        };
    });

    // Sous-catégories à part si besoin
    const subcategories = await prisma.postCategory.findMany({
        where: {
            parentId: {
                in: categories.map(cat => cat.id)
            }
        },
    });

    res.json({
        success: true,
        message: "Catégories collectées",
        data: categoriesWithImages,
        catsCount: categories.length,
        subcatsCount: subcategories.length
    });
});

exports.getCategoryFields = catchAsync(async (req, res) => {
    const { id } = req.params;

    const category = await prisma.postCategory.findUnique({
        where: { id },
        select: { id: true, name: true, formSchema: true }
    });

    if (!category) return next(AppError('Catégorie non trouvée', 404));

    res.json({ success: true, data: category.formSchema || { fields: [] } });
});

exports.getCategoryBySlug = catchAsync(async (req, res) => {
    const { slug } = req.params;

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Get category with its subcategories in a single query
    const category = await prisma.postCategory.findUnique({
        where: { slug },
        include: {
            children: true, // Include subcategories
            parent: true,    // Include parent category if exists
        }
    });

    if (!category) {
        return next(new AppError('Catégorie non trouvée', 404));
    }

    // Add full image URL if image exists
    const categoryWithImage = {
        ...category,
        image: category.image
            ? `${baseUrl}/public/images/categories/${category.slug}/${category.image}`
            : null
    };

    const postsInthisCategory = await prisma.post.findMany({
        where: { categoryId: category.id },
        include: { author: true }
    })

    res.json({
        success: true,
        message: 'Catégorie récupérée avec succès',
        data: {
            category,
            ...categoryWithImage
        },
        posts: postsInthisCategory,
    });
});

exports.getSubcategoryBySlug = catchAsync(async (req, res) => {
    const { subcatSlug } = req.params;

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Récupérer la sous-catégorie avec son parent
    const subcategory = await prisma.listingCategory.findUnique({
        where: { slug: subcatSlug },
        include: { parent: true } // pour savoir à quelle catégorie principale elle appartient
    });

    if (!subcategory) {
        return next(new AppError('Sous-catégorie non trouvée', 404));
    }

    // Construire l’objet avec image complète
    const subcategoryWithImage = {
        ...subcategory,
        image: subcategory.image
            ? `${baseUrl}/public/images/categories/${subcategory.slug}/${subcategory.image}`
            : null
    };

    // Récupérer les annonces dans cette sous-catégorie
    const postsInSubcategory = await prisma.listing.findMany({
        where: { categoryId: subcategory.id },
        include: {
            user: true, // si tu veux récupérer infos du vendeur
            // éventuellement d’autres relations (ex: store)
        }
    });

    res.json({
        success: true,
        message: 'Sous-catégorie récupérée avec succès',
        data: subcategoryWithImage,
        posts: postsInSubcategory
    });
});

exports.getSubcategoryById = catchAsync(async (req, res) => {
    const { categoryId, subcategoryId } = req.params;
    const { lang = 'fr' } = req.query;

    const categoriesData = await CategoryService.loadCategories();

    const category = categoriesData.categories.find(
        cat => cat.categoryId === parseInt(categoryId)
    );

    const subcategory = category.container.find(
        subcat => subcat.sousCategoryId === parseInt(subcategoryId)
    );

    if (!subcategory) {
        return next(new AppError('Sous-catégorie non trouvée', 404));
    }

    const result = {
        id: subcategory.id,
        sousCategoryId: subcategory.sousCategoryId,
        sousCategoryName: subcategory.sousCategoryName,
        sousCategoryTitle: subcategory.sousCategoryTitles[lang] || subcategory.sousCategoryTitles.fr,
        sousCategoryTitles: subcategory.sousCategoryTitles,
        sousContainer: subcategory.sousContainer,
        parentCategory: {
            categoryId: category.categoryId,
            categoryName: category.categoryName,
            categoryTitle: category.categoryTitles[lang] || category.categoryTitles.fr
        }
    };

    res.json({
        success: true,
        message: 'Sous-catégorie récupérée avec succès',
        data: result
    });
});

exports.getCategoryByImageName = catchAsync(async (req, res, next) => {
    const { imageName } = req.params;

    // Validation du nom de fichier pour éviter les attaques de traversée de répertoire
    if (!imageName || imageName.includes('..') || imageName.includes('/')) {
        return next(new AppError('Nom de fichier invalide', 400));
    }

    const imagePath = path.join(__dirname, '../public/images/categories', imageName);

    await fs.access(imagePath);

    // Headers CORS pour les images
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');

    // Déterminer le type MIME
    const ext = path.extname(imageName).toLowerCase();
    const mimeTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml'
    };

    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    // Définir les en-têtes de cache
    res.set({
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=86400', // Cache pendant 24h
        'ETag': `"${imageName}"`,
        'Last-Modified': new Date().toUTCString()
    });

    // Envoyer le fichier
    res.sendFile(imagePath);
});