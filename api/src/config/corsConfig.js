const whitelist = [
    'http://adscity.net:3000',
    'http://auth.adscity.net:3001',
    'http://id.adscity.net:3002',
    'http://dashboard.adscity.net:3003',
    'http://help.adscity.net:3004',
    'http://admin.adscity.net:3005',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:4000',
];

const corsConfig = {
    origin: function (origin, callback) {
        // autorise aussi les requêtes sans origin (mobile, Postman, etc.)
        if (!origin || whitelist.includes(origin) || origin.startsWith("exp://")) {
            callback(null, true);
        } else {
            console.warn('🚫 CORS refusé pour origine :', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // ✅ pour envoyer les cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', ' x-csrf-token'],
    optionsSuccessStatus: 200 // ✅ pour que le préflight ne plante pas
};

module.exports = corsConfig;