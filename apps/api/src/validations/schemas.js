const { z } = require("zod");

// Vérification basique téléphone (ex: 10 chiffres FR ou CI, tu peux ajuster le regex)
const phoneRegex = /^[0-9]{8,15}$/;

// ✅ Validation pour connexion (email ou téléphone)
exports.signinSchema = z.object({
    emailOrPhone: z.string().min(1, "Email ou téléphone requis").refine((val) => {
        // Soit email valide, soit numéro valide
        return z.string().email().safeParse(val).success || phoneRegex.test(val);
    }, {
        message: "Doit être un email valide ou un numéro de téléphone valide"
    }),
    password: z.string().min(1, "Mot de passe requis"),
    rememberMe: z.boolean().optional(),
    captchaToken: z.string().min(1, "CAPTCHA requis")
});

// ✅ Validation pour inscription
exports.signupSchema = z.object({
    firstName: z.string().min(2, "Prénom trop court"),
    lastName: z.string().min(2, "Nom trop court"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Mot de passe trop court"),
});

// ✅ Validation pour la création de ticket
exports.createTicketSchema = z.object({
    subject: z.string().min(5, "Sujet trop court"),
    category: z.string().min(1),
    body: z.string().min(10, "Décrire le problème"),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    // attachments are handled via multipart/form-data
});

exports.createMessageSchema = z.object({
    body: z.string().min(1),
    internal: z.boolean().optional() // only support can set
});
