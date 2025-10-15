exports.validateMiddleware = (schema) => {
    return (req, res, next) => {
        if (!schema || typeof schema.safeParse !== "function") {
            console.error("❌ Schema invalide ou non-Zod :", schema);
            return res.status(500).json({ message: "Erreur interne : schéma invalide" });
        }

        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Erreur de validation",
                errors: Array.isArray(result.error?.errors)
                    ? result.error.errors.map(e => ({
                        path: e.path.join("."),
                        message: e.message
                    }))
                    : [{ path: "global", message: result.error?.message || "Validation échouée" }]
            });
        }

        req.validatedData = result.data; // ✅ données validées
        next();
    };
};