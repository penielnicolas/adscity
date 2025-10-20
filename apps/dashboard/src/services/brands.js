const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000'

export const getBrandBySlug = async (slug) => {
    const response = await fetch(`${API_URL}/api/brands/${slug}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch brands');
    }

    const data = await response.json();
    console.log(data)
    return data;
};