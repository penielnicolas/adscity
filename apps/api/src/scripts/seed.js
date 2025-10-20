const path = require('path');
const fs = require('fs').promises;
const { prisma } = require("../config/db");
const { categories, admins } = require("../data");
const { hashPassword } = require('../utils/jwt');

exports.main = async () => {
    try {
        for (const category of categories) {
            // Check if category already exists
            const existingCategory = await prisma.postCategory.findUnique({
                where: { slug: category.slug }
            });

            if (!existingCategory) {
                const parent = await prisma.postCategory.create({
                    data: {
                        name: category.name,
                        slug: category.slug,
                        image: category.image,
                    }
                });

                for (const child of category.children) {
                    const existingChild = await prisma.postCategory.findUnique({
                        where: { slug: child.slug }
                    });

                    const formSchemaPath = path.join(__dirname, `../data/forms/${child.slug}.form.json`);
                    const formSchemaData = await fs.readFile(formSchemaPath, 'utf8');
                    const parsed = JSON.parse(formSchemaData);

                    if (!existingChild) {
                        await prisma.postCategory.create({
                            data: {
                                name: child.name,
                                slug: child.slug,
                                image: child.image,
                                parentId: parent.id,
                                formSchema: parsed
                            }
                        });
                    }
                }
            }
        }

        // Vérifier si des administrateurs existent déjà
        const existingAdmins = await prisma.user.findMany({
            where: {
                role: {
                    in: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR']
                }
            }
        });

        // Si des administrateurs existent déjà, ne rien faire
        if (existingAdmins.length > 0) {
            console.log('Des administrateurs existent déjà dans la base de données.');
            return;
        }

        for (const admin of admins) {
            const hash = await hashPassword(admin.password);
            const user = await prisma.user.create({
                data: {
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    phone: admin.phone,
                    email: admin.email,
                    emailVerified: admin.emailVerified,
                    isActive: admin.isActive,
                    password: hash,
                    role: admin.role,
                }
            });

            await prisma.email.create({
                data: {
                    email: user.email,
                    userId: user.id,
                    verified: user.emailVerified,
                    isLoginAllowed: true,
                    types: ['PRIMARY', 'CONTACT'],
                    verifiedAt: new Date()
                }
            });
        }

        console.log('🎉 Seed terminé avec succès!');
    } catch (error) {
        console.error('❌ Erreur lors du seed:', error);
        throw error;
    }
}