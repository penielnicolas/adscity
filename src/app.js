const express = require('express');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');

// Routes
const adminRoute = require('./routes/admin.route');
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const postRoute = require('./routes/post.route');
const activityRoute = require('./routes/activity.route');
const categoryRoute = require('./routes/category.route');
const formSchemaRoute = require('./routes/form-schema.route');
const suggestionsRoutes = require('./routes/suggestions.route');
const bankRoute = require('./routes/bank.route');
const pushRoute = require('./routes/push.route');
const notifyRoute = require('./routes/notify.route');
const brandRoute = require("./routes/brand.route");
const supportRoute = require('./routes/support.route');
const keyRoute = require('./routes/key.route');
const reportRoute = require('./routes/report.route');

const router = express.Router();


dotenv.config();

// ⚙️ Middlewares nécessaires
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());


// ⚔️ Protection CSRF
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // true si HTTPS
        domain: ".adscity.net",
    },
});

router.get("/csrf-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});


router.use('/admin', adminRoute);
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/posts', postRoute);
router.use('/activity', activityRoute);
router.use('/categories', categoryRoute);
router.use('/form-schema', formSchemaRoute);
router.use('/suggestions', suggestionsRoutes);
router.use('/banks', bankRoute);
router.use('/push', pushRoute);
router.use('/notifications', notifyRoute);
router.use("/brands", brandRoute);
router.use('/support', supportRoute);
router.use('/keys', keyRoute);
router.use('/reports', reportRoute);

module.exports = router;