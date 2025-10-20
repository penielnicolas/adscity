const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function connectDB() {
    console.log("🚀 === CONNEXION DATABASE ===")
    try {
        await prisma.$connect();
        console.log('✅ PostgreSQL connecté avec Prisma\n');
    } catch (error) {
        console.error('❌ Erreur connexion PostgreSQL:', error);
        process.exit(1);
    }
};

module.exports = { prisma, connectDB };