import {
    Home, FileText,
    BarChart3, FileCheck, Settings, HelpCircle,
    User,
} from "lucide-react";

const ID_URL = process.env.REACT_APP_ID_URL;

export const Icon404 = require('../imgs/404.png');
export const defaultAvatar = require('../imgs/default-avatar.png');

export const logos = {
    textBlueWithoutBg: require('../assets/icons/blue-no-bg.png'),
    letterWhiteBgBlue: require('../assets/icons/logo-letter-bg.png'),
    letterBlueBgWhite: require('../assets/icons/logo-letter-light.png'),
    textWhiteBgBlue: require('../assets/icons/logo-text-bg.png'),
    textBlueBgWhite: require('../assets/icons/logo-text-light.png'),
    textWhiteWithoutBg: require('../assets/icons/white-no-bg.png'),
};

export const navItems = (userRole) => {
    const baseItems = [
        {
            path: '/',
            icon: <Home size={20} />,
            label: 'Accueil',
            description: 'Vue d’ensemble de vos annonces et activités'
        },
        {
            path: '/posts',
            icon: <FileText className="text-blue" size={20} />,
            label: 'Mes annonces',
            description: 'Gérez vos annonces, leurs statuts et leurs performances'
        },
        {
            path: '/sponsored',
            icon: <BarChart3 className="text-indigo" size={20} />,
            label: 'Statuts sponsorisés',
            description: 'Boostez la visibilité de vos annonces et suivez leur impact'
        },
        {
            path: '/verification',
            icon: <FileCheck className="text-emerald" size={20} />,
            label: 'Documents de vérification',
            description: 'Téléversez et gérez vos documents de vérification'
        },
        {
            path: '/settings',
            icon: <Settings className="text-gray" size={20} />,
            label: 'Paramètres',
            description: 'Personnalisez votre expérience et configurez votre boutique'
        },
        {
            path: `${ID_URL}/help`,
            icon: <HelpCircle className="text-red" size={20} />,
            label: 'Aide',
            description: 'Obtenez de l’aide et suivez vos demandes de support'
        },
        {
            path:  `${ID_URL}`,
            icon: <User className="text-blue" size={20} />,
            label: 'Mon compte',
            description: 'Gérez vos informations personnelles et vos paramètres'
        }
    ];

    return baseItems;
};
