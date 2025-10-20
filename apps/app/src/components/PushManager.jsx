import { useEffect } from "react";
import { subscribe } from "../services/push";

const VAPID_PUBLIC_KEY = process.env.REACT_APP_VAPID_PUBLIC_KEY;

export default function PushManager() {
    useEffect(() => {
        if ("serviceWorker" in navigator && "PushManager" in window) {
            navigator.serviceWorker.register("/sw.js").then(async (reg) => {
                console.log("SW enregistré ✅");

                const permission = await Notification.requestPermission();
                if (permission !== "granted") return;

                const subscription = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
                });

                // Envoi au backend
                await subscribe(subscription);
                console.log("Push abonné ✅", subscription);
            });
        }
    }, []);

    return null;
}

// Helper (convertir clé publique)
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
