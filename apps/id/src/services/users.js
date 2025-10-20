const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000'

export const updateUserProfile = async (userId, field, value) => {
    const resp = await fetch(`${API_URL}/api/users/${userId}/profile`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, value })
    });

    if (!resp.ok) {
        throw new Error("Failed to update user profile");
    }

    const data = await resp.json();

    console.log(data)

    return data;
};