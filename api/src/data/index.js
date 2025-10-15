const categories = [
    {
        name: 'Mode & Beauté', slug: 'fashion-and-beauty', image: "fashion-and-beauty.png", children: [
            { name: 'Vêtements homme', slug: 'men-clothing' },
            { name: 'Vêtements femme', slug: 'women-clothing' },
            { name: 'Chaussures homme', slug: 'men-shoes' },
            { name: 'Chaussures femme', slug: 'women-shoes' },
            { name: 'Sacs & Accessoires', slug: 'bags-accessories' },
            { name: 'Montres & Bijoux', slug: 'watches-jewelry' },
            { name: 'Cosmétique & Parfums', slug: 'cosmetics-perfumes' }
        ]
    },
    {
        name: 'Immobilier', slug: 'real-estate', image: "real-estate.png", children: [
            { name: 'Vente Maisons', slug: 'house-sale' },
            { name: 'Location Maisons', slug: 'house-rent' },
            { name: 'Location Meublés', slug: 'furnished-rent' },
            { name: 'Appartements', slug: 'apartments' },
            { name: 'Terrains', slug: 'land' },
            { name: 'Bureaux & Commerces', slug: 'office-business' },
            { name: 'Colocation', slug: 'shared-rent' }
        ]
    },
    {
        name: 'Véhicules', slug: 'vehicles', image: "vehicles.png", children: [
            { name: 'Voitures', slug: 'cars' },
            { name: 'Motos & Scooters', slug: 'motorcycles' },
            { name: 'Camions & Bus', slug: 'trucks-buses' },
            { name: 'Accessoires Auto/Moto', slug: 'auto-accessories' },
            { name: 'Pièces détachées', slug: 'car-parts' }
        ]
    },
    {
        name: 'Téléphones & Tablettes', slug: 'phones-tablets', image: "phones-tablets.png", children: [
            { name: 'Smartphones', slug: 'smartphones' },
            { name: 'Tablettes', slug: 'tablets' },
            { name: 'Accessoires téléphonie', slug: 'phone-accessories' },
            { name: 'Téléphones fixes', slug: 'landlines' }
        ]
    },
    {
        name: 'Informatique & Électronique', slug: 'electronics', image: "electronics.png", children: [
            { name: 'Ordinateurs portables', slug: 'laptops' },
            { name: 'Ordinateurs de bureau', slug: 'desktops' },
            { name: 'Accessoire PC', slug: 'computer-accessories' },
            { name: 'Télévisions', slug: 'tvs' },
            { name: 'Appareil photo', slug: 'cameras' },
            { name: 'Consoles & Jeux vidéo', slug: 'gaming' },
            { name: 'Imprimantes & Scanners', slug: 'printers' }
        ]
    },
    {
        name: 'Maison & Électroménager', slug: 'home-appliances', image: "home-appliances.png", children: [
            { name: 'Meubles', slug: 'furniture' },
            { name: 'Cuisine & Vaisselle', slug: 'kitchen' },
            { name: 'Lave-linge & Réfrigérateurs', slug: 'laundry-fridge' },
            { name: 'Climatisation & Ventilation', slug: 'air-conditioning' },
            { name: 'Luminaires', slug: 'lighting' },
            { name: 'Décoration', slug: 'decoration' },
        ]
    },
    {
        name: 'Enfants & Bébés', slug: 'kids-baby', image: "kids-baby.png", children: [
            { name: 'Vêtements enfants', slug: 'kids-clothing', image: 'kids-clothing.png' },
            { name: 'Jouets', slug: 'toys', image: 'toys.png' },
            { name: 'Puériculture & Equipements', slug: 'baby-care', image: 'baby-care.png' },
            { name: 'Accessoires scolaires', slug: 'school-accessories', image: 'school-accessories.png' }
        ]
    },
    {
        name: 'Emploi & Services', slug: 'jobs-services', image: "jobs-services.png", children: [
            { name: "Offres d'emploi", slug: 'job-offers' },
            { name: "Demandes d'emploi", slug: 'job-requests' },
            { name: "Cours particuliers", slug: 'private-lessons' },
            { name: "Services à domicile", slug: 'home-services' },
            { name: "Transport & Déménagement", slug: 'moving' },
            { name: "Réparation & Bricolage", slug: 'repair' },
            { name: "Beauté & Bien-être", slug: 'beauty' },
        ]
    },
    {
        name: 'Matériaux & Industrie', slug: 'industrial', image: "industrial.png", children: [
            { name: 'Matériaux de construction', slug: 'construction' },
            { name: 'Équipements industriels', slug: 'equipment' },
            { name: 'Machines & Outils', slug: 'tools' },
            { name: 'Fournitures agricoles', slug: 'agriculture' }
        ]
    },
    {
        name: 'Animaux', slug: 'pets', image: "pets.png", children: [
            { name: 'Chiens & Chats', slug: 'dogs-cats' },
            { name: 'Oiseaux & Rongeurs', slug: 'birds-rodents' },
            { name: 'Accessoires pour animaux', slug: 'pet-accessories' },
            { name: 'Autres animaux', slug: 'other-pets' }
        ]
    },
    {
        name: 'Loisirs & Divertissement', slug: 'leisure', image: "leisure.png", children: [
            { name: 'Livres & Magazines', slug: 'books' },
            { name: 'Instruments de musique', slug: 'music' },
            { name: 'Billetterie & Événements', slug: 'tickets-events' },
            { name: 'Art & Artisanat', slug: 'art' },
            { name: 'Sports & Fitness', slug: 'sports' }
        ]
    },
    {
        name: 'Alimentation & Nutrition', slug: 'food-and-nutrition', image: "food-and-nutrition.png", children: [
            { name: 'Produits frais', slug: 'fresh-products' },
            { name: 'Épicerie', slug: 'grocery' },
            { name: 'Boissons', slug: 'drinks' },
            { name: 'Compléments alimentaires', slug: 'dietary-supplements' },
            { name: 'Produits faits maison', slug: 'homemade-products' }
        ]
    }
];

const admins = [
    {
        email: 'superadmin@adscity.net',
        password: "MySuperAdminPassword123@!",
        firstName: 'Super',
        lastName: 'Admin',
        phone: '+2250700000000',
        role: 'SUPER_ADMIN',
        emailVerified: true,
        isActive: true
    },
    {
        email: 'admin@adscity.net',
        password: "MyAdminPassword123@!",
        firstName: 'System',
        lastName: 'Admin',
        phone: '+2250700000001',
        role: 'ADMIN',
        emailVerified: true,
        isActive: true
    },
    {
        email: 'moderator@adscity.net',
        password: "MyModeratorPassword123@!",
        firstName: 'Content',
        lastName: 'Moderator',
        phone: '+2250700000002',
        role: 'MODERATOR',
        emailVerified: true,
        isActive: true
    },
    {
        email: 'user@adscity.net',
        password: "MyUserPassword123@!",
        firstName: 'Plateform',
        lastName: 'User',
        phone: '+2250700000003',
        role: 'USER',
        emailVerified: true,
        isActive: true
    }
];

module.exports = {admins, categories}