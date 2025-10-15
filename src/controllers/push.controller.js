const { AppError } = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

const PushNotification = require('../services/push-notification.service');

exports.subscribe = catchAsync(async (req, res, next) => {
    const subscription = req.body;
    if (!subscription || !subscription.endpoint || !subscription.keys) {
        return next(new AppError("Subscription invalide", 400));
    }

    await PushNotification.addSubscription(subscription);
    res.status(201).json({ message: "Subscription enregistrée !" });
});

exports.notify = catchAsync(async (req, res, next) => {
    const { title, body, url } = req.body;

    const payload = { title, body, url, icon: "/favicon.png" };
    await PushNotification.sendNotification(payload);

    res.json({ message: "Notifications envoyées !" });
});