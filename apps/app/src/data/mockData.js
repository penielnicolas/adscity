
export const postlist = [
    {
        id: 1,
        post: {
            details: {
                title: "Vente iPhone 16 Pro Max Noir Neuf",
                price: "358750",
                currency: "XOF",
                desc: "Tout neuf dans carton depuis Dubai."
            },
            images: [
                require('../imgs/post/1.png'),
                require('../imgs/post/2.png'),
                require('../imgs/post/3.png'),
                require('../imgs/post/4.png'),
                require('../imgs/post/5.png'),
                require('../imgs/post/6.png'),
            ],
            location: {
                city: "Abidjan"
            },
            category: 'Smartphones & Tablettes',
            postedAt: "à l'instant",
            isPromoted: true,
            isReserved: true,
            isSold: true,
        },
        author: {
            firstName: "Andy",
            lastName: "Shopping",
            avatar: require('../imgs/post/1.png'), 
            emailVerified: true, 
            phoneVerified: false,
            isPro: true,
            verified: true,
            rating: 4.5,
            ratingCount: 123,
        },
    },
]