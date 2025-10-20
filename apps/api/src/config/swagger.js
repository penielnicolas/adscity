const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "AdsCity API",
            version: "1.0.0",
            description: `
                Documentation de l'API AdsCity (utilisateurs, annonces, boutiques, messagerie, notifications)

                Cette API permet aux membres de la communauté de:
                - S'inscrire et s'authentifier
                - Gérer leurs profils
                - Publier des annonces avec médias (photos/vidéos)
                - Interagir socialement (likes, commentaires, messages, partages)
                - Recevoir des notifications
                - Créer et gérer des boutiques
                - S'abonner/se désabonner d'une boutique

                ## Authentification
                L'API utilise l'authentification JWT. Incluez le token dans le header:
                \`Authorization: Bearer <your-token>\`
            `,
            contact: {
                name: 'Support API',
                email: 'support@adscity.net'
            }
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://api.adscity.net/api/v1'
                    : `http://localhost:${process.env.PORT || 5000}/api/v1`,
                description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Entrez votre token JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid', example: 'uuid-1234-5678' },
                        userId: { type: 'string', example: 'user-1234' },
                        email: { type: 'string', format: 'email', example: 'user-1234@email.com' },
                        phone: { type: 'string', format: 'phone-pad', example: '+7 (123) 456 78-90' },
                        firstName: { type: 'string', example: 'Joe' },
                        lastName: { type: 'string', example: 'Doe' },
                        avatar: { type: 'string', format: 'url' },
                        location: { type: 'string', example: 'Sovietskaya 12, Moscow, Russia' },
                        isEmailVerified: { type: 'boolean', example: 'true' },
                        isPhoneVerified: { type: 'boolean', example: 'false' },
                        createdAt: { type: 'string', format: 'date-time', example: '2025-08-16T12:34:56.000Z' }
                    }
                },
                Shop: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        slug: { type: 'string' },
                        description: { type: 'string' },
                        avatar: { type: 'string', format: 'url' },
                        banner: { type: 'string', format: 'url' },
                        category: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Listing: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid', example: 'uuid-1234-5678' },
                        postId: { type: 'string', example: 'post-1234' },
                        category: { type: 'string', example: 'electronics' },
                        subcategory: { type: 'string', example: 'smartphones' },
                        details: { type: 'array', items: { type: 'object' } },
                        images: {
                            type: 'array',
                            items: { type: 'string', format: 'url' }
                        },
                        items: { type: 'object' },
                        location: { type: 'array', items: { type: 'object' } },
                        visibility: {
                            type: 'string',
                            enum: ['PUBLIC', 'PRIVATE', 'FOLLOWERS']
                        },
                        author: { $ref: '#/components/schemas/User' },
                        likesCount: { type: 'integer' },
                        commentsCount: { type: 'integer' },
                        sharesCount: { type: 'integer' },
                        isLiked: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time', example: '2025-08-16T12:34:56.000Z' }
                    }
                },
                Ticket: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid', example: 'uuid-1234-5678' },
                        reference: { type: 'string', example: 'TCK_20250908_0001' },
                        category: { type: 'string', example: 'billing' },
                        priority: {
                            type: 'string',
                            enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
                        },
                        status: {
                            type: 'string',
                            enum: ['OPEN', 'CLOSED', 'RESOLVED', 'IN_PROGRESS']
                        },
                        author: { $ref: '#/components/schemas/User' },
                        createdAt: { type: 'string', format: 'date-time', example: '2025-08-16T12:34:56.000Z' }
                    }
                },
                ActivityLog: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid', example: 'uuid-1234-5678' },
                        userId: { type: 'string', example: 'user-1234' },
                        action: { type: 'string', example: 'RESET_PASSWORD' },
                        description: { type: 'string', example: 'Mot de passe réinitialisé' },
                        ipAddress: { type: 'string', example: '192.168.0.12' },
                        userAgent: { type: 'string', example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                        createdAt: { type: 'string', format: 'date-time', example: '2025-08-16T12:34:56.000Z' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'error' },
                        message: { type: 'string' },
                        details: { type: 'array', items: { type: 'object' } }
                    }
                },
                Success: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        message: { type: 'string' },
                        data: { type: 'object' }
                    }
                }
            },
            responses: {
                UnauthorizedError: {
                    description: 'Token d\'authentification manquant ou invalide',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                ValidationError: {
                    description: 'Erreur de validation des données',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                NotFoundError: {
                    description: 'Ressource non trouvée',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                RateLimitError: {
                    description: 'Trop de requêtes, limite atteinte',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        tags: [
            {
                name: 'Authentication',
                description: 'Gestion de l\'authentification et des comptes utilisateurs'
            },
            {
                name: 'Users',
                description: 'Gestion des profils utilisateurs et interactions sociales'
            },
            {
                name: 'Listings',
                description: 'Publications, médias et interactions (likes, partages)'
            },
            {
                name: 'Comments',
                description: 'Système de commentaires sur les publications'
            },
            {
                name: 'Messages',
                description: 'Messagerie privée entre utilisateurs'
            },
            {
                name: 'Notifications',
                description: 'Système de notifications en temps réel'
            },
            {
                name: 'Support Ticket',
                description: 'Système de support ticket (entre utilisateur et admin)'
            }
        ]
    },
    apis: ["./src/routes/*.js"], // chemins où Swagger va lire les annotations JSDoc
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
    // Configuration Swagger UI
    const swaggerOptions = {
        customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #2c5530; }
      .swagger-ui .scheme-container { background: #f8f9fa; }
    `,
        customSiteTitle: "API AdsCity Backend",
        customfavIcon: "/favicon.ico",
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            defaultModelsExpandDepth: 2,
            defaultModelExpandDepth: 2,
            docExpansion: 'list',
            filter: true,
            showRequestHeaders: true
        }
    };

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

    // Endpoint pour récupérer le JSON Swagger
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });

    console.log(`📚 Documentation Swagger disponible sur: http://localhost:${process.env.PORT || 5000}/api-docs`);
};

module.exports = { setupSwagger, specs };