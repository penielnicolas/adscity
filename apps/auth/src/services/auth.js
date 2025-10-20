import { getCsrfToken, resetCsrfToken } from "./csrf";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000'

// Fonction utilitaire pour les requêtes protégées CSRF
const makeCsrfRequest = async (url, options = {}) => {
    let token;
    try {
        token = await getCsrfToken();
    } catch (error) {
        console.error('Impossible de récupérer le token CSRF:', error);
        throw new Error('CSRF token unavailable');
    }

    const config = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'xsrf-token': token, // Essayez avec ce header
            'x-csrf-token': token, // Et avec cet autre
            'csrf-token': token, // Et celui-ci aussi
        },
        ...options
    };

    const response = await fetch(url, config);
    
    // Si CSRF invalide, reset et relance une fois
    if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.code === 'EBADCSRFTOKEN' || errorData.message?.includes('CSRF')) {
            console.warn('CSRF token invalide, régénération...');
            resetCsrfToken();
            token = await getCsrfToken();
            
            config.headers['xsrf-token'] = token;
            config.headers['x-csrf-token'] = token;
            config.headers['csrf-token'] = token;
            
            return await fetch(url, config);
        }
    }
    
    return response;
};


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

// Connexion
// POST /api/auth/signin
export const signInWithEmailOrPhoneAndPassword = async (emailOrPhone, password, rememberMe, captchaToken) => {
    try {
        const resp = await makeCsrfRequest(`${API_URL}/api/auth/signin`, {
            method: 'POST',
            body: JSON.stringify({ emailOrPhone, password, rememberMe, captchaToken }),
        });

        const data = await resp.json();

        if (!resp.ok) {
            return {
                success: false,
                status: resp.status,
                message: data?.message || "Échec de connexion"
            };
        }

        return {
            success: true,
            ...data
        };
    } catch (error) {
        console.error('Erreur connexion:', error);
        return {
            success: false,
            message: error.message || "Erreur réseau"
        };
    }
};

// Création de compte
// POST /api/auth/create-user
export const createUser = async (email, phoneNumber, firstName, lastName, password, captchaToken) => {
    const resp = await makeCsrfRequest(`${API_URL}/api/auth/create-user`, {
        method: 'POST',
        credentials: 'include', // ✅ garder le cookie de session
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phoneNumber, firstName, lastName, password, captchaToken }),
    });

    if (!resp.ok) {
        throw new Error("Failed to create a user");
    }

    const result = await resp.json();
    return result;
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

export const verifyEmailOTPCode = async (email, code) => {
    const response = await makeCsrfRequest(`${API_URL}/api/auth/email-code/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
        throw new Error('Failed to send email code verification');
    }

    const data = await response.json();
    return data;
};

export const verifyPhoneOTPCode = async (email, code) => {
    const response = await makeCsrfRequest(`${API_URL}/api/auth/phone-code/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
        throw new Error('Failed to verify phone code verification');
    }

    const data = await response.json();
    return data;
};

export const sendPhoneOTPCode = async (email, phone) => {
    const response = await makeCsrfRequest(`${API_URL}/api/auth/otp-code/send`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phone }),
    });

    if (!response.ok) {
        throw new Error('Failed to send phone verification code');
    }

    const data = await response.json();
    return data;
};

export const resendPhoneOTPCode = async (email, phone) => {
    const response = await makeCsrfRequest(`${API_URL}/api/auth/otp-code/send`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phone }),
    });

    if (!response.ok) {
        throw new Error('Failed to send phone verification code');
    }

    const data = await response.json();
    return data;
};

export const sendEmailOTPCode = async (email) => {
    const response = await makeCsrfRequest(`${API_URL}/api/auth/resend-otp-code`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error('Failed to send email verification code');
    }

    const data = await response.json();
    return data;
};

export const verifyPassword = async (password) => {
    const response = await fetch(`${API_URL}/api/auth/verify-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
    });

    if (!response.ok) {
        throw new Error('Failed to verify password');
    }

    const data = await response.json();
    return data;
};

// POST /api/auth/refresh-token
export const forgotPassword = async (email, captchaValue) => {
    const response = await makeCsrfRequest(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, captchaValue }),
    });

    if (!response.ok) {
        throw new Error('Failed to send password reset email');
    }

    const data = await response.json();
    return data;
}; 




// const authServices = {
//     signinUser: async (email, password, rememberMe, captchaValue, ip, browser, os, device, isTabel, isMobile, isBot) => {

//         const response = await fetch(`${api_URL}/api/auth/signin`, {
//             method: 'POST',
//             credentials: 'include',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ email, password, rememberMe, captchaValue, ip, browser, os, device, isTabel, isMobile, isBot }),
//         });

//         const data = await response.json();

//         if (response.status === 403 && data?.needsAccountVerification) {
//             window.location.href = "/verify-account";
//             throw new Error("Account verification is required");
//         }

//         if (!response.ok) {
//             throw new Error("Failed to sign in");
//         }

//         console.log(data)

//         return data;
//     },
//     // Création de compte
//     // POST /api/auth/signup
//     register: async (email, password, phoneNumber, firstName, lastName, displayName, captchaToken) => {
//         const response = await fetch(`${api_URL}/api/auth/register`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ email, password, phoneNumber, firstName, lastName, displayName, captchaToken }),
//         });

//         if (!response.ok) {
//             throw new Error('Failed to register');
//         }

//         const data = await response.json();
//         return data;
//     },
//     // Déconnexion
//     // POST /api/auth/signout
//     signoutUser: async () => {
//         const response = await fetch(`${api_URL}/api/auth/signout`, {
//             method: 'POST',
//             credentials: 'include',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (!response.ok) {
//             throw new Error('Failed to sign out');
//         }

//         const data = await response.json();
//         console.log("User signed out:", data);
//         return data;
//     },
//     // Rafraîchir le token et mettre à jour le cookie
//     sendPhoneCode: async (phone, token) => {
//         const response = await fetch(`${api_URL}/api/auth/send-phone-code`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify({ phone }),
//         });

//         if (!response.ok) {
//             throw new Error('Failed to send phone code verification');
//         }

//         const data = await response.json();
//         console.log(data);
//         return data;
//     },
//     verifyPhoneCode: async (phone, code, token) => {
//         const response = await fetch(`${api_URL}/api/auth/verify-phone-code`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify({ phone, code }),
//         });

//         if (!response.ok) {
//             throw new Error('Failed to verify phone code');
//         }

//         const data = await response.json();
//         console.log(data);
//         return data;
//     },
//     sendOtpChallenge: async (email, token) => {
//         const response = await fetch(`${api_URL}/api/auth/send-otp-code`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify({ email }),
//         });

//         if (!response.ok) {
//             throw new Error('Failed to send email verification code');
//         }

//         const data = await response.json();
//         return data;
//     },
    
//     addRecoveryEmail: async (token, email, type) => {
//         const response = await fetch(`${api_URL}/api/auth/add-recovery-email`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify({ email, type: 'RECOVERY' }),
//         });

//         if (!response.ok) {
//             throw new Error('Failed to add recovery email');
//         }

//         const data = await response.json();
//         console.log(data);
//         return data;
//     },
// };

// export default authServices;
