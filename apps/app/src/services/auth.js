const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const whoami = async () => {

    const resp = await fetch(`${API_URL}/api/auth/whoami`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!resp.ok) {
        throw new Error("Failed to get currentUser");
    }

    const data = await resp.json();

    return data;
};

// POST /api/auth/refresh-token
export const refreshToken = async () => {
    const response = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data; // ou data si tu veux renvoyer tout l'objet
};