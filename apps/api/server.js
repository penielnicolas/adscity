const express = require('express');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const { connectDB } = require('./src/config/db');
const initSocket = require('./src/sockets/socket');
const { main } = require('./src/scripts/seed');
const corsOptions = require('./src/config/corsConfig');
const router = require('./src/app');
const { cleanupVerificationCodes } = require('./src/cron/cleanupVerificationCodes');
const { deactivateInactiveUsers } = require('./src/cron/deactivateInactiveUsers');
const { testConnection } = require('./src/utils/smtpLogger');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// 🧠 Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));
app.set('trust proxy', 1);

// Debug cookies
app.use((req, res, next) => {
    console.log("Cookies reçus :", req.cookies);
    console.log("Header reçu :", req.headers['user-agent']);
    next();
});

// Fichiers publics
app.use('/public', express.static(path.join(__dirname, 'src/public')));

// API routes
app.use('/api', router);

// Root
app.get('/', (req, res) => {
    res.json({ success: true, message: "AdsCity API is running 🚀" });
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'AdsCity Backend API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// Gestion des erreurs CSRF
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({
            success: false,
            message: 'CSRF token invalide ou manquant',
            code: 'INVALID_CSRF_TOKEN'
        });
    }

    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
    });
});

// Socket.io init
initSocket(server);

// Démarrage
connectDB().then(() => {
    server.listen(PORT, async () => {
        await main();
        await testConnection();
        cleanupVerificationCodes();
        deactivateInactiveUsers();

        console.log(`🚀 Serveur sur http://localhost:${PORT}`);
        console.log('🔐 CSRF configured for development');
        console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
    });
});
