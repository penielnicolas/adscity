const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

let csrfToken = null;

// GET /api/csrf-token
export const getCsrfToken = async () => {
    const resp = await fetch(`${API_URL}/api/csrf-token`, {
        method: 'GET',
        credentials: 'include', // ✅ important, sinon cookie de session perdu
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!resp.ok) {
        throw new Error('Failed to get CSRF Token');
    }

    const data = await resp.json();
    csrfToken = data.csrfToken; // ✅ stocker globalement
    return csrfToken;
};

// Getter pratique pour l’utiliser partout
export const getStoredCsrfToken = () => csrfToken;

export const fetchPosts = async () => {
    const response = await fetch(`${API_URL}/api/posts`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    return response.json();
};

export const deletePost = async (postId) => {
    const response = await fetch(`${API_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken,
        }
    });
    if (!response.ok) {
        throw new Error('Failed to delete post');
    }
    return response.json();
};
