const API_URL = process.env.REACT_APP_API_URL;

export const subscribe = async (subscription) => {
    const response = await fetch(`${API_URL}/api/push/subscribe`, {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json',
        },
    }); 
    if (!response.ok) {
        throw new Error('Failed to subscribe to push notifications');
    }
    return await response.json();
};