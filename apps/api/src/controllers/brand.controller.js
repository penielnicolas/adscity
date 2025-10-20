const path = require('path');
const fs = require('fs');
const { catchAsync } = require('../utils/catchAsync');

exports.getBrandBySlug = catchAsync(async (req, res, next) => {
    const { slug } = req.params;

    const filePath = path.join(__dirname, `../data/brands/${slug}.brand.json`);
    const rawData = fs.readFileSync(filePath, "utf-8");
    const brands = JSON.parse(rawData);

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const result = brands.map(brand => ({
        ...brand,
        icon: `${baseUrl}/public/images/brands/${slug}/${brand.icon}`
    }));

    res.json({
        success: true,
        data: result,
        count: result.length
    });
});

exports.getCarBrands = catchAsync(async (req, res, next) => {
    const filePath = path.join(__dirname, "../data/brands/cars.brand.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const brands = JSON.parse(rawData);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = brands.map(brand => ({
        ...brand,
        icon: `${baseUrl}/public/images/brands/cars/${brand.icon}`
    }));

    res.json({
        success: true,
        data: result,
        count: result.length
    });
});

exports.getPhoneBrands = catchAsync(async (req, res, next) => {
    const filePath = path.join(__dirname, "../data/brands/phones.brand.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const brands = JSON.parse(rawData);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = brands.map(brand => ({
        ...brand,
        icon: `${baseUrl}/public/images/brands/phones/${brand.icon}`
    }));

    res.json({
        success: true,
        data: result,
        count: result.length
    });
});