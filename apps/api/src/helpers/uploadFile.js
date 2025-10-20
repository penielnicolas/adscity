const cloudinary = require('../config/cloudinaryConfig');

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

// Fonction générique pour upload
const uploadFile = (file, folder) => {
    return new Promise((resolve, reject) => {
        const { mimetype, size } = file;

        // Vérification type et taille
        if (mimetype.startsWith("image/")) {
            if (!ALLOWED_IMAGE_TYPES.includes(mimetype)) {
                return reject(new Error("Format d'image non supporté"));
            }
            if (size > MAX_IMAGE_SIZE) {
                return reject(new Error("Image trop lourde (max 5 Mo)"));
            }
        } else if (mimetype.startsWith("video/")) {
            if (!ALLOWED_VIDEO_TYPES.includes(mimetype)) {
                return reject(new Error("Format vidéo non supporté"));
            }
            if (size > MAX_VIDEO_SIZE) {
                return reject(new Error("Vidéo trop lourde (max 50 Mo)"));
            }
        } else {
            return reject(new Error("Type de fichier non supporté"));
        }

        cloudinary.uploader
            .upload_stream({ resource_type: 'auto', folder }, (error, result) => {
                if (error) return reject(error);
                resolve({ url: result.secure_url, type: mimetype });
            })
            .end(file.buffer);
    });
};

// Pour les posts
exports.uploadPostFile = (file) => uploadFile(file, "posts");

// Pour les statuts
exports.uploadStatusFile = (file) => uploadFile(file, "statuses");

// Pour les profils
exports.uploadProfileFile = (file) => uploadFile(file, "profiles");