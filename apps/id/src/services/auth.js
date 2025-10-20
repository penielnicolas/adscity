const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000'

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

    console.log(data)

    return data;
};