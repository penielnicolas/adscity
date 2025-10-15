const cloudinary = require('cloudinary').v2;

// Configuration de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Utiliser HTTPS
});

// Test de la connexion
const testConnection = async () => {
    try {
        const result = await cloudinary.api.ping();
        console.log('✅ Connexion Cloudinary réussie');
        return result;
    } catch (error) {
        console.error('❌ Erreur connexion Cloudinary:', error.message);
        throw error;
    }
};

// Créer des dossiers pour l'organisation
const createFolders = async () => {
    const folders = ['avatars', 'listings', 'messages'];

    try {
        for (const folder of folders) {
            await cloudinary.api.create_folder(`adscity/${folder}`);
        }
        console.log('✅ Dossiers Cloudinary créés');
    } catch (error) {
        // Les dossiers existent peut-être déjà
        if (!error.message.includes('already exists')) {
            console.error('❌ Erreur création dossiers Cloudinary:', error.message);
        }
    }
};

// Initialiser Cloudinary
const initializeCloudinary = async () => {
    try {
        await testConnection();
        await createFolders();
        console.log('🚀 Cloudinary initialisé avec succès');
    } catch (error) {
        console.error('❌ Échec initialisation Cloudinary:', error.message);
    }
};

// Initialiser au démarrage si les variables d'environnement sont présentes
if (process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET) {
    initializeCloudinary();
};

module.exports = cloudinary;