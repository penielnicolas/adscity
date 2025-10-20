const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const reportController = require('../controllers/report.controller');
const { reportLimiter } = require('../middlewares/rate-limiter.middleware');
const router = express.Router();

router.post(
    '/', 
    authenticate, 
    reportLimiter, 
    reportController.createReport
);

// router.get(
//     '/', 
//     authenticate, 
//     reportController.getReports
// );
// router.get(
//     '/:id', 
//     authenticate, 
//     reportController.getReportById
// );

// router.delete(
//     '/:id', 
//     authenticate, 
//     reportController.deleteReport
// );

module.exports = router;