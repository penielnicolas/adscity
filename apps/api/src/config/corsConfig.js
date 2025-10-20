const allowedOrigins = [
    'https://adscity.net',
    'https://auth.adscity.net',
    'https://id.adscity.net',
    'https://admin.adscity.net',
    'https://dashboard.adscity.net',
    'https://help.adscity.net',
    'https://pay.adscity.net',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3006'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Autoriser les requêtes sans origin (mobile apps, postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // ✅ pour envoyer les cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-csrf-token',
        'csrf-token',
        'xsrf-token',
        'X-Requested-With'
    ],
};

module.exports = corsOptions;