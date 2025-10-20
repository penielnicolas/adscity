const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

let csrfToken = null;
let csrfInitialized = false;

export const initializeCsrf = async () => {
    if (csrfInitialized) return csrfToken;

    try {
        const resp = await fetch(`${API_URL}/api/csrf/token`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!resp.ok) {
            throw new Error(`Failed to get CSRF Token: ${resp.status}`);
        }

        const data = await resp.json();
        csrfToken = data.csrfToken;
        csrfInitialized = true;

        console.log("✅ CSRF Token initialisé:", csrfToken);
        return csrfToken;
    } catch (error) {
        console.error('❌ Erreur initialisation CSRF:', error);
        csrfInitialized = false;
        throw error;
    }
};

export const getCsrfToken = async () => {
    if (!csrfToken) {
        await initializeCsrf();
    }
    return csrfToken;
};

export const getStoredCsrfToken = () => csrfToken;

export const resetCsrfToken = () => {
    csrfToken = null;
    csrfInitialized = false;
};

