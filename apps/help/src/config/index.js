
export const logos = {
    textBlueWithoutBg: require('../assets/icons/blue-no-bg.png'),
    letterWhiteBgBlue: require('../assets/icons/logo-letter-bg.png'),
    letterBlueBgWhite: require('../assets/icons/logo-letter-light.png'),
    textWhiteBgBlue: require('../assets/icons/logo-text-bg.png'),
    textBlueBgWhite: require('../assets/icons/logo-text-light.png'),
    textWhiteWithoutBg: require('../assets/icons/white-no-bg.png'),
};

export const navigation = [
    { name: 'Accueil', href: '#home' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Guides', href: '#guides' },
    { name: 'API', href: '#api' },
    { name: 'Contact', href: '#contact' },
];

export const categories = [
    {
        title: 'Questions Fréquentes',
        description: 'Réponses aux questions les plus courantes',
        //   icon: HiQuestionMarkCircle,
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        articles: 45
    },
    {
        title: 'Guide Utilisateur',
        description: 'Guides pas à pas pour utiliser AdsCity',
        //   icon: BookOpenIcon,
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-50',
        articles: 32
    },
    {
        title: 'Documentation API',
        description: 'Intégration et développement',
        //   icon: CodeBracket,
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50',
        articles: 28
    },
    {
        title: 'Support & Contact',
        description: 'Contactez notre équipe support',
        //   icon: ChatBubbleLeftRightIcon,
        color: 'from-orange-500 to-orange-600',
        bgColor: 'bg-orange-50',
        articles: 15
    },
    {
        title: 'Sécurité',
        description: 'Conseils et bonnes pratiques',
        //   icon: ShieldCheckIcon,
        color: 'from-red-500 to-red-600',
        bgColor: 'bg-red-50',
        articles: 22
    },
    {
        title: 'Paiements',
        description: 'Facturation et transactions',
        //   icon: CreditCardIcon,
        color: 'from-indigo-500 to-indigo-600',
        bgColor: 'bg-indigo-50',
        articles: 18
    }
];

export const faqs = [
    {
        id: 1,
        question: "Comment publier ma première annonce ?",
        answer: "Pour publier votre première annonce sur AdsCity, connectez-vous à votre compte et cliquez sur 'Publier une annonce'. Remplissez tous les champs obligatoires, ajoutez des photos de qualité, et définissez un prix compétitif. Votre annonce sera en ligne après validation."
    },
    {
        id: 2,
        question: "Mes annonces sont-elles gratuites ?",
        answer: "AdsCity propose différentes formules. La publication d'annonces de base est gratuite avec certaines limitations. Des options premium sont disponibles pour plus de visibilité et de fonctionnalités avancées."
    },
    {
        id: 3,
        question: "Comment contacter un vendeur ?",
        answer: "Vous pouvez contacter un vendeur en cliquant sur le bouton 'Contacter' sur sa page d'annonce. Vous pouvez envoyer un message via notre système de messagerie intégré ou utiliser les coordonnées affichées si le vendeur les a partagées."
    },
    {
        id: 4,
        question: "Comment modifier ou supprimer mon annonce ?",
        answer: "Connectez-vous à votre espace personnel, allez dans 'Mes annonces', puis cliquez sur l'annonce que vous souhaitez modifier. Vous pouvez la modifier, la mettre en pause ou la supprimer définitivement."
    },
    {
        id: 5,
        question: "Que faire en cas de problème avec un acheteur/vendeur ?",
        answer: "En cas de problème, utilisez notre système de signalement disponible sur chaque annonce. Notre équipe de modération examine chaque signalement et prend les mesures appropriées. Vous pouvez aussi nous contacter directement via le support."
    },
    {
        id: 6,
        question: "Comment sécuriser mes transactions ?",
        answer: "Privilégiez les rencontres en lieu public et sûr, vérifiez l'identité de votre interlocuteur, méfiez-vous des prix trop attractifs, et utilisez nos conseils de sécurité disponibles dans la section dédiée."
    }
];