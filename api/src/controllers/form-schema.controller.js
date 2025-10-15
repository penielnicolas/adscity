const path = require('path');
const fs = require('fs').promises;

const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require('../utils/AppError');

exports.getFormBySlug = catchAsync(async (req, res) => {
    const { slug } = req.params;

    if (!slug) return next(new AppError('Le paramètre "slug" est requis', 400));

    const formSchemaPath = path.join(__dirname, `../data/forms/${slug}.form.json`);
    const formSchemaData = await fs.readFile(formSchemaPath, 'utf8');
    const parsed = JSON.parse(formSchemaData);

    // On récupère le champ correspondant à la sous-catégorie
    if (parsed) {
        return res.status(200).json({
            success: true,
            message: 'Formulaire du "paramètre" récupéré avec succès',
            fields: parsed
        });
    } else {
        return res.status(400).json({
            success: false,
            message: "Aucun formaulaire n'a pu etre chargé",
            fields: null,
        });
    }
});