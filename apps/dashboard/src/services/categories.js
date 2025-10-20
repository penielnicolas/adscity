const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000'

export const getCategories = async () => {
    const response = await fetch(`${API_URL}/api/categories`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    console.log(data)
    return data;
};

export const getFieldsBySlug = async (slug) => {
    console.log(`Fetching fields with slug: ${slug}`);
    const response = await fetch(`${API_URL}/api/form-schema/${slug}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch fields');
    }

    const data = await response.json();
    console.log(data)
    return data;
};