const webpush = require('web-push');
const { prisma } = require('../config/db');
const { createTransporter } = require('../utils/mailer');

const HOME_URL = process.env.HOME_URL || 'http://localhost:3000';

// ✅ VAPID keys (utilise celles générées avant)
webpush.setVapidDetails(
    'mailto:support@adscity.net',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);


// Ajouter une subscription
const addSubscription = async (subscription) => {
    try {
        // Éviter les doublons
        await prisma.pushSubscription.upsert({
            where: { endpoint: subscription.endpoint },
            update: {
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            },
            create: {
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            },
        });
    } catch (error) {
        console.error("Erreur pendant l'ajout de la souscription:", error);
    }
}

// Supprimer une subscription
const removeSubscription = async (endpoint) => {
    try {
        await prisma.pushSubscription.delete({
            where: { endpoint },
        });
    } catch (err) {
        console.error("Erreur removeSubscription:", err);
    }
}

// Envoyer une notification à toutes les subscriptions
const sendNotification = async (payload) => {
    const data = JSON.stringify(payload);
    const subscriptions = await prisma.pushSubscription.findMany();

    await Promise.all(
        subscriptions.map(async (sub) => {
            try {
                await webpush.sendNotification(sub, data);
            } catch (err) {
                console.error("Erreur notif pour un sub:", err);

                // Si endpoint invalide, le supprimer
                if (err.statusCode === 410 || err.statusCode === 404) {
                    await removeSubscription(sub.endpoint);
                }
            }
        })
    );
};

// Créer le payload pour une annonce
const createPostNotification = (post) => {
    const url = `${HOME_URL}/category/${post.category}/${post.subcategory}/post/${post.details?.title}`;
    return {
        title: "Nouvelle annonce 🚀",
        body: `${post.details?.title} vient d’être publié`,
        url: url,
        icon: "/favicon.ico"
    };
};

const sendToSupportQueue = async (ticket) => {
    // 1) Email Support
    const transporter = await createTransporter();

    const options = {
        from: `"AdsCity Support" <${process.env.SMTP_MAIL}>`,
        to: process.env.SUPPORT_TEAM_EMAIL || "support@adscity.net",
        subject: `🆕 Nouveau ticket support #${ticket.reference}`,
        html: `
            <h3>Nouveau ticket créé</h3>
            <p><strong>Référence:</strong> ${ticket.reference}</p>
            <p><strong>Sujet:</strong> ${ticket.subject}</p>
            <p><strong>Catégorie:</strong> ${ticket.category}</p>
            <p><strong>Priorité:</strong> ${ticket.priority}</p>
        `,
    }

    await transporter.sendMail(options);

    // 2) WebPush (si tu as des abonnements d’admins stockés en DB)
    if (process.env.WEB_PUSH_PUBLIC && process.env.WEB_PUSH_PRIVATE) {
        // Exemple : récupérer abonnements support depuis DB
        const supportSubscriptions = []; // await prisma.pushSubscription.findMany({ where: { role: "SUPPORT" } });

        for (const sub of supportSubscriptions) {
            try {
                await webpush.sendNotification(
                    sub,
                    JSON.stringify({
                        title: "Nouveau ticket support",
                        body: `#${ticket.reference} - ${ticket.subject}`,
                        url: `/admin/support/tickets/${ticket.id}`,
                    })
                );
            } catch (err) {
                console.error("❌ Erreur WebPush :", err.message);
            }
        }
        console.log(`✅ Ticket ${ticket.reference} envoyé dans la queue support`);
    }
};

const notifyUser = async (userId, message, ticket) => {
    if (!userId) return;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    // Email
    if (user.email) {
        const transporter = await createTransporter();

        await transporter.sendMail({
            from: `"AdsCity Support" <${process.env.SMTP_MAIL}>`,
            to: user.email,
            subject: `💬 Nouveau message dans votre ticket #${ticket.reference}`,
            html: `
        <p>Bonjour ${user.firstName} ${user.lastName},</p>
        <p>Vous avez reçu un nouveau message :</p>
        <blockquote>${message.body}</blockquote>
        <p><a href="${process.env.APP_URL}/support/tickets/${ticket.id}">
          Consulter le ticket
        </a></p>
      `,
        });
    }

    // WebPush
    if (process.env.WEB_PUSH_PUBLIC && process.env.WEB_PUSH_PRIVATE) {
        const subscriptions = await prisma.pushSubscription.findMany({
            where: { userId },
        });

        for (const sub of subscriptions) {
            try {
                await webpush.sendNotification(
                    sub,
                    JSON.stringify({
                        title: "Nouveau message support",
                        body: message.body.substring(0, 100),
                        url: `/support/tickets/${ticket.id}`,
                    })
                );
            } catch (err) {
                console.error("❌ WebPush error:", err.message);
            }
        }
    }
};

const notifySupport = async (message, ticket) => {
    const supportUsers = await prisma.user.findMany({
        where: { roles: { hasSome: ["SUPPORT", "ADMIN"] } },
    });

    for (const agent of supportUsers) {
        await notifyUser(agent.id, message, ticket);
    }
}

module.exports = {
    addSubscription,
    removeSubscription,
    sendNotification,
    createPostNotification,
    sendToSupportQueue,
    notifySupport,
    notifyUser
};