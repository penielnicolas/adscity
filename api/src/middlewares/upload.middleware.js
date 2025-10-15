const multer = require('multer');

// Extensions autorisées
const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'text/plain'
];

// Filtrage fichiers
function fileFilter(req, file, cb) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error('Type de fichier non supporté'), false);
    }
    cb(null, true);
}

// Utilisation mémoire (on push ensuite vers Cloud)
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 Mo max
    },
    fileFilter
});

module.exports = upload;
