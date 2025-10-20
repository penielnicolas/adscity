import { UAParser } from 'ua-parser-js';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// 📌 Fonction pour récupérer les informations du périphérique
const collectDeviceInfo = async () => {
    try {
        const parser = new UAParser();
        const result = parser.getResult();
        const ip = await fetchIPAddress();
        const location = await fetchLocation(ip);


        return {
            browser: result.browser.name || 'Unknown',
            os: result.os.name || 'Unknown',
            device: result.device.type || 'desktop',
            model: result.device.model || 'Unknown',
            browserVersion: result.browser.version || 'Unknown',
            osVersion: result.os.version || 'Unknown',
            ip: ip,
            location: location || 'Unknown',
        };
    } catch (error) {
        console.error("Erreur lors de la collecte des infos du périphérique :", error);
        return {
            browser: 'Unknown',
            os: 'Unknown',
            device: 'Unknown',
            ip: 'Unknown',
        };
    }
};


// 📌 Fonction pour récupérer l'adresse IP de l'utilisateur
const fetchIPAddress = async () => {
    try {
        const controller = new AbortController();
        const timeoutID = setTimeout(() => controller.abort(), 5000);
        const response = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
        clearTimeout(timeoutID);

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de l\'IP');
        }

        const data = await response.json();
        return data.ip || "Unknown";
    } catch (error) {
        console.error("Erreur lors de la récupération de l'IP :", error);
        return 'Unknown';
    }
};

// 📌 Fonction pour récupérer la localisation à partir de l'IP
const fetchLocation = async (ip) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/get/ip-info/${ip}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de la localisation');
        }

        const data = await response.json();
        console.log(data);
        return {
            city: data.city || 'Unknown',
            region: data.region || 'Unknown',
            country: data.country_name || 'Unknown',
        };
    } catch (error) {
        console.error("Erreur lors de la récupération de la localisation :", error);
        return 'Unknown';
    }
};

export { collectDeviceInfo };