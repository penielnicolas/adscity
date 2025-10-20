const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000'


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
    console.log("CSRF Token récupéré:", csrfToken);

    return csrfToken;
};

// Getter pratique pour l’utiliser partout
export const getStoredCsrfToken = () => csrfToken;


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
    if (!csrfToken) {
        await getCsrfToken(); // ✅ assure-toi d’avoir un token
    }

    const resp = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrfToken,
        },
        body: JSON.stringify({ emailOrPhone, password, rememberMe, captchaToken }),
    });


    let data;
    try {
        data = await resp.json();
        console.log(data)
    } catch {
        data = {};
    }

    if (!resp.ok) {
        return {
            success: false,
            status: data?.status,
            message: data?.message || "Échec de connexion"
        };
    }
    return data;
};


// Création de compte
// POST /api/auth/create-user
export const createUser = async (email, phoneNumber, firstName, lastName, password, captchaToken) => {
    if (!csrfToken) {
        await getCsrfToken(); // ✅ assure-toi d’avoir un token
    }

    const resp = await fetch(`${API_URL}/api/auth/create-user`, {
        method: 'POST',
        credentials: 'include', // ✅ garder le cookie de session
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrfToken,
        },
        body: JSON.stringify({ email, phoneNumber, firstName, lastName, password, captchaToken }),
    });

    if (!resp.ok) {
        throw new Error("Failed to create a user");
    }

    const data = await resp.json();

    console.log(data)

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
    console.log("Token refreshed:", data);
    return data; // ou data si tu veux renvoyer tout l'objet
};

export const verifyEmailCode = async (email, code) => {
    const response = await fetch(`${API_URL}/api/auth/verify-code`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
        throw new Error('Failed to send code verification');
    }

    const data = await response.json();
    console.log(data);
    return data;
};

export const sendEmailVerificationCode = async (email) => {
    const response = await fetch(`${API_URL}/api/auth/resend-otp-code`, {
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
//     forgotPassword: async (email, captchaValue) => {
//         const response = await fetch(`${api_URL}/api/auth/forgot-password`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ email, captchaValue }),
//         });

//         if (!response.ok) {
//             throw new Error('Failed to send password reset email');
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
