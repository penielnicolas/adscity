const sessionConfig = {
    name: "adscity.sid", // nom du cookie
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      domain: ".adscity.net", // ✅ Partagé entre tous les sous-domaines
      httpOnly: true,
      secure: false, // ⚠️ à mettre sur true en production (HTTPS)
      sameSite: "lax", // ou "none" si HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    },
};

module.exports = sessionConfig;
