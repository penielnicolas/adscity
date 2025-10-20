export const logos = {
    textBlueWithoutBg: require('../assets/icons/blue-no-bg.png'),
    letterWhiteBgBlue: require('../assets/icons/logo-letter-bg.png'),
    letterBlueBgWhite: require('../assets/icons/logo-letter-light.png'),
    textWhiteBgBlue: require('../assets/icons/logo-text-bg.png'),
    textBlueBgWhite: require('../assets/icons/logo-text-light.png'),
    textWhiteWithoutBg: require('../assets/icons/white-no-bg.png'),
};

export const resetPasswordRules = {
    password: {
        required: true,
        minLength: 8,
        maxLength: 128,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        messages: {
            required: 'Le mot de passe est requis',
            minLength: 'Le mot de passe doit contenir au moins 8 caractères',
            maxLength: 'Le mot de passe est trop long',
            pattern: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
        }
    },
    confirmPassword: {
        required: true,
        messages: {
            required: 'La confirmation du mot de passe est requise',
            match: 'Les mots de passe ne correspondent pas'
        }
    }
}

export const resetPasswordFormValidationRules = {
    email: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        maxLength: 254,
        messages: {
            required: 'L\'adresse email est requise',
            pattern: 'Veuillez saisir une adresse email valide',
            maxLength: 'L\'adresse email est trop longue',
            exists: 'Cette adresse email est déjà utilisée'
        }
    },
};

export const registerFormValidationRules = {
    firstName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        messages: {
            required: 'Le prénom est requis',
            minLength: 'Le prénom doit contenir au moins 2 caractères',
            maxLength: 'Le prénom ne doit pas dépasser 50 caractères'
        }
    },
    lastName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        messages: {
            required: 'Le nom est requis',
            minLength: 'Le nom doit contenir au moins 2 caractères',
            maxLength: 'Le nom ne doit pas dépasser 50 caractères'
        }
    },
    email: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        maxLength: 254,
        messages: {
            required: 'L\'adresse email est requise',
            pattern: 'Veuillez saisir une adresse email valide',
            maxLength: 'L\'adresse email est trop longue',
            exists: 'Cette adresse email est déjà utilisée'
        }
    },
    password: {
        required: true,
        minLength: 8,
        maxLength: 128,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        messages: {
            required: 'Le mot de passe est requis',
            minLength: 'Le mot de passe doit contenir au moins 8 caractères',
            maxLength: 'Le mot de passe est trop long',
            pattern: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
        }
    },
    confirmPassword: {
        required: true,
        messages: {
            required: 'La confirmation du mot de passe est requise',
            match: 'Les mots de passe ne correspondent pas'
        }
    }
}

// Règles de validation (déplacées en dehors du composant pour éviter les re-créations)
export const emailValidationRules = {
    email: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        maxLength: 254,
        messages: {
            required: 'L\'adresse email est requise',
            pattern: 'Veuillez saisir une adresse email valide',
            maxLength: 'L\'adresse email est trop longue',
            exists: 'Cette adresse email est déjà utilisée'
        }
    },
    password: {
        required: true,
        minLength: 8,
        maxLength: 128,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        messages: {
            required: 'Le mot de passe est requis',
            minLength: 'Le mot de passe doit contenir au moins 8 caractères',
            maxLength: 'Le mot de passe est trop long',
            pattern: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
        }
    },
    confirmPassword: {
        required: true,
        messages: {
            required: 'La confirmation du mot de passe est requise',
            match: 'Les mots de passe ne correspondent pas'
        }
    }
};

export const validationRules = {
    email: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        maxLength: 254,
        messages: {
            required: 'L\'adresse email est requise',
            pattern: 'Veuillez saisir une adresse email valide',
            maxLength: 'L\'adresse email est trop longue',
            exists: 'Cette adresse email est déjà utilisée'
        }
    },
    password: {
        required: true,
        minLength: 8,
        maxLength: 128,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        messages: {
            required: 'Le mot de passe est requis',
            minLength: 'Le mot de passe doit contenir au moins 8 caractères',
            maxLength: 'Le mot de passe est trop long',
            pattern: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
        }
    },
};

// Configuration des étapes
export const stepFields = {
    0: ['firstName', 'lastName'],
    1: ['email'],
    2: ['password', 'confirmPassword']
};