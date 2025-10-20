const { prisma } = require("../config/db");
const { AppError } = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

exports.getSuggestions = catchAsync(async (req, res, next) => {
    const { lang = 'fr', includeSubcategories = 'true' } = req.query;
    const q = (req.query.q || '').trim().toLowerCase();

    if (!q) return next(new AppError('Query param "q" is required', 400));

    const categories = await prisma.postCategory.findMany({
        where: { parentId: null },
        include: {
            children: true
        }
    });

    const suggestions = [];
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Parcourir chaque catégorie
    for (const category of categories) {
        const catTitle = category.name.toLowerCase();
        const catSlug = category.slug.toLowerCase();
        const catName = category.name;
        const catImage = `${baseUrl}/public/images/categories/${category.slug}/${category.image}`;

        // Vérifier si la catégorie correspond à la recherche (nom ou slug)
        if (catTitle.includes(q) || catSlug.includes(q)) {
            suggestions.push({
                id: category.id,
                name: catName,
                category: catName,
                subcategory: '',
                displayCategory: null,
                image: catImage,
                type: 'category',
            });
        }

        // Vérifier les sous-catégories si demandé
        if (includeSubcategories === 'true') {
            for (const subcat of category.children) {
                const subcatTitle = subcat.name.toLowerCase();
                const subcatSlug = subcat.slug.toLowerCase();
                const subcatName = subcat.name;

                // Vérifier si la sous-catégorie correspond à la recherche (nom ou slug)
                if (subcatTitle.includes(q) || subcatSlug.includes(q)) {
                    suggestions.push({
                        id: subcat.id,
                        name: subcatName,
                        category: catName,
                        subcategory: subcatName,
                        displayCategory: catName,
                        image: catImage,
                        type: 'subcategory',
                    });
                }
            }
        }
    }

    res.json({
        status: 'success',
        results: suggestions.length,
        data: suggestions
    });
});