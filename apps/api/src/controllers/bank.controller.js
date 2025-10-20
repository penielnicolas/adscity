const path = require('path');
const fs = require('fs').promises;

const { catchAsync } = require("../utils/catchAsync");

exports.getBankLogos = catchAsync(async (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const bankLogoPath = path.join(__dirname, '../public/images/banks');

    // Lire les fichiers dans le dossier
    const files = await fs.readdir(bankLogoPath);

    // Construire les URLs accessibles publiquement
    const logos = files.map(file => `${baseUrl}/public/images/banks/${file}`);

    res.json({
        success: true,
        data: logos
    });
});