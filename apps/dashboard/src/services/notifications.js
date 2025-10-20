const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000'

export const getUserPreferences = async (userId) => {
    const resp = await fetch(`${API_URL}/api/notifications/preferences/${userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!resp.ok) {
        throw new Error("Failed to get user preferences");
    }

    const data = await resp.json();

    console.log(data)

    return data;
};

export const updateUserPreferences = async (userId, preferences) => {
    const resp = await fetch(`${API_URL}/api/notifications/preferences/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
    });

    if (!resp.ok) {
        throw new Error("Failed to update user preferences");
    }

    const data = await resp.json();

    console.log(data)
    return data;
}