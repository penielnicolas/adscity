import { Bell, CreditCard, FileCheck, FileText, HelpCircle, Home, LayoutDashboard, Mail, MessageCircle, Search, Settings, Shield, ShieldAlert, Smartphone, Star, Store, User } from 'lucide-react';

const ADMIN_URL = process.env.REACT_APP_ADMIN_URL;
const DASHBOARD_URL = process.env.REACT_APP_DASHBOARD_URL;
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


export const notificationTypes = [
    { key: 'SYSTEM', label: 'Notifications système' },
    { key: 'SAVED_SEARCH', label: 'Recherches enregistrées' },
    { key: 'PAID_SERVICE', label: 'Services monnayables' },
    { key: 'PERSONAL_COLLECTION', label: 'Collections personnelles' },
    { key: 'ADSCITY_PROMOTION', label: 'Promotions AdsCity' },
    { key: 'VENDOR_DISCOUNT', label: 'Réductions des vendeurs' },
    { key: 'MESSAGE', label: 'Messages' },
    { key: 'FEEDBACK', label: 'Participation à la recherche / Avis' },
    { key: 'DELIVERY', label: 'Statut de livraison' },
];

export const channels = [
    { key: 'EMAIL', label: 'Email', icon: <Mail size={16} /> },
    { key: 'SMS', label: 'SMS', icon: <Smartphone size={16} /> },
    { key: 'PUSH', label: 'Push' },
    { key: 'BROWSER', label: 'Notifications navigateur' },
];


export const navItems = (userRole) => {
    const baseItems = [
        {
            path: '/',
            icon: <Home size={20} />,
            label: 'Accueil',
            description: 'Gérez vos informations, ainsi que la confidentialité et la sécurité de vos données pour profiter au mieux des services AdsCity'
        },
        {
            path: '/favorites',
            icon: <Star className="text-yellow" size={20} />,
            label: 'Favoris',
            description: 'Consultez et organisez vos annonces enregistrées'
        },
        {
            path: '/profile',
            icon: <User className='text-blue' size={20} />,
            label: 'Profile',
            description: 'Infos sur vous et vos préférences dans les services AdsCity'
        },
        {
            path: '/notifications',
            icon: <Bell className="text-purple" size={20} />,
            label: 'Notifications',
            description: 'Recevez et gérez vos alertes et rappels'
        },
        {
            path: '/security',
            icon: <Shield className='text-emerald' size={20} />,
            label: 'Sécurité',
            description: 'Paramètres et recommandations pour vous aider à protéger votre compte'
        },
        {
            path: '/settings',
            icon: <Settings className='text-gray' size={20} />,
            label: 'Paramètres',
            description: 'Personnalisez votre expérience sur AdsCity'
        },
        {
            path: '/payments-and-subscriptions',
            icon: <CreditCard className='text-purple' size={20} />,
            label: 'Paiements et abonnements',
            description: 'Vos informations de paiement, vos transactions, vos paiements récurrents et vos réservations'
        },
        {
            path: '/security-center',
            icon: <ShieldAlert className='text-amber' size={20} />,
            label: 'Centre de Sécurité',
            description: 'Surveillez les activités suspectes et protégez votre compte'
        },
        {
            path: '/help',
            icon: <HelpCircle className='text-red' size={20} />,
            label: 'Aide',
            description: 'Obtenez de l\'aide et suivez vos demandes de support'
        }
    ];

    // Ajouter la boutique selon le rôle
    if (userRole === ('SUPER_ADMIN' || 'ADMIN' || 'MODERATOR')) {
        baseItems.splice(6, 0, {
            path: `${ADMIN_URL}`,
            icon: <LayoutDashboard className='text-blue' size={20} />,
            label: 'Tableau de bord',
            description: 'Accédez à l\'interface d\'administration pour gérer les utilisateurs, les produits et les transactions.'
        });
    } else if (userRole === 'USER') {
        baseItems.splice(3, 0, {
            path: '/messenger',
            icon: <MessageCircle className='text-purple' size={20} />,
            label: 'Messenger',
            description: 'Discutez avec vos contacts et gérez vos messages sur AdsCity'
        });
        baseItems.splice(5, 0, {
            path: '/verification',
            icon: <FileCheck className="text-emerald" size={20} />,
            label: 'Documents de vérification',
            description: 'Téléversez et gérez vos documents de vérification'
        });
        baseItems.splice(12, 0, {
            path: `${DASHBOARD_URL}`,
            icon: <Store className='text-blue' size={20} />,
            label: 'Boutique',
            description: 'Gérez votre boutique et vos produits sur AdsCity'
        });
    }

    return baseItems;
};

export const tabs = [
    { value: "posts", label: "Annonces", icon: <FileText size={18} /> },
    { value: "searches", label: "Recherches", icon: <Search size={18} /> },
    { value: "profiles", label: "Profils", icon: <User size={18} /> },
];