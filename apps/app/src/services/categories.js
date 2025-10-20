const API_URL = process.env.REACT_APP_API_URL;

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
    return data;
};

export const getCategoryBySlug = async (slug) => {
    const response = await fetch(`${API_URL}/api/categories/${slug}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch category by slug');
    }

    const data = await response.json();
    return data;
};
export const getSubcategoryBySlug = async (subcatSlug) => {
    const response = await fetch(`${API_URL}/api/categories/subcategory/${subcatSlug}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch subcategory by slug');
    }

    const data = await response.json();
    return data;
};
