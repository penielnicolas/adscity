/* ========================
   Service Worker - AdsCity
   ======================== */

self.addEventListener("push", (event) => {
    if (!event.data) return;

    const payload = event.data.json();

    const title = payload.title || "AdsCity 🚀";
    const options = {
        body: payload.body || "Nouvelle notification",
        icon: payload.icon || "/favicon.ico", // icône principale
        badge: "/logo192.png", // petit icône de badge
        data: {
            url: payload.url || "/", // URL à ouvrir quand on clique
        },
        actions: [
            {
                action: "open",
                title: "Voir",
            },
            {
                action: "close",
                title: "Ignorer",
            },
        ],
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Quand l’utilisateur clique sur une notification
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    if (event.action === "close") return;

    const targetUrl = event.notification.data.url || "/";
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            // Si onglet déjà ouvert → focus
            for (const client of clientList) {
                if (client.url === targetUrl && "focus" in client) {
                    return client.focus();
                }
            }
            // Sinon ouvrir un nouvel onglet
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
