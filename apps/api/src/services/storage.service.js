const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Choisir CLOUDINARY
const USE_CLOUDINARY = process.env.STORAGE_PROVIDER === 'cloudinary';

// ========== CLOUDINARY ==========
let cloudinary;
if (USE_CLOUDINARY) {
    cloudinary = require('cloudinary').v2;
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

/**
 * Upload un fichier en mémoire vers le stockage choisi
 * @param {Express.Multer.File} file
 * @returns {Promise<{ url: string, filename: string, mimeType: string, size: number }>}
 */
async function uploadToStorage(file) {
    if (!file) throw new Error('Aucun fichier à uploader');

    const ext = path.extname(file.originalname) || '';
    const filename = `${uuidv4()}${ext}`;

    // CLOUDINARY
    if (USE_CLOUDINARY) {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { public_id: filename, resource_type: 'auto', folder: 'support' },
                (err, result) => {
                    if (err) return reject(err);
                    resolve({
                        url: result.secure_url,
                        filename: result.public_id,
                        mimeType: file.mimetype,
                        size: file.size
                    });
                }
            ).end(file.buffer);
        });
    }

    // LOCAL fallback
    return {
        url: `/uploads/${filename}`,
        filename,
        mimeType: file.mimetype,
        size: file.size
    };
}

module.exports = { uploadToStorage };