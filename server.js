const express = require('express');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const { connectDB } = require('./src/config/db');
const { main } = require('./src/scripts/seed');
const initSocket = require('./src/sockets/socket');
const corsConfig = require('./src/config/corsConfig');
const router = require('./src/app');
const { cleanupVerificationCodes } = require('./src/cron/cleanupVerificationCodes');
const { deactivateInactiveUsers } = require('./src/cron/deactivateInactiveUsers');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// 🧠 Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfig));
app.use(helmet());
app.use(morgan("dev"));
app.set('trust proxy', 1);

// Debug cookies
app.use((req, res, next) => {
    console.log("Cookies reçus :", req.cookies);
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

// Socket.io init
initSocket(server);

// Démarrage
connectDB().then(() => {
    server.listen(PORT, async () => {
        await main();
        cleanupVerificationCodes();
        deactivateInactiveUsers();

        console.log(`🚀 Serveur sur http://localhost:${PORT}`);
        console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
    });
});
