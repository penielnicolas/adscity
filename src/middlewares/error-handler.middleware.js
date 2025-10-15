const { AppError } = require("../utils/AppError");

const handleCastErrorDB = (err) => {
    const message = `Ressource non trouvée avec l'ID: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const value = err.keyValue[Object.keys(err.keyValue)[0]];
    const message = `Cette valeur existe déjà: ${value}. Veuillez utiliser une autre valeur!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Données invalides. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError('Token invalide. Veuillez vous reconnecter!', 401);

const handleJWTExpiredError = () =>
    new AppError('Token expiré! Veuillez vous reconnecter.', 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
        details: err.details
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        // ✅ On envoie les infos utiles
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            details: err.details
        });
    } else {
        // ❌ Erreur inconnue → masquer les détails
        console.error("ERROR 💥", err);

        res.status(500).json({
            success: false,
            status: "error",
            message: "Une erreur s'est produite!"
        });
    }
};

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else {
        // ⚠️ On ne clone pas avec { ...err }, on garde les propriétés de Error
        let error = err;

        // Prisma errors
        if (error.code === "P2002") error = handleDuplicateFieldsDB(error);
        if (error.code === "P2025") error = handleCastErrorDB(error);

        // Mongoose / validation errors
        if (error.name === "ValidationError") error = handleValidationErrorDB(error);

        // JWT errors
        if (error.name === "JsonWebTokenError") error = handleJWTError();
        if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};

module.exports = { globalErrorHandler };
