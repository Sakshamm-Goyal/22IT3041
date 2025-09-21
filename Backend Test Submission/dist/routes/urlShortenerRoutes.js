"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = require("../middleware/logger");
const urlShortenerController_1 = require("../controllers/urlShortenerController");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// Middleware to log all requests
router.use(async (req, _res, next) => {
    try {
        await logger_1.logger.info('route', `${req.method} ${req.path} - IP: ${req.ip}`);
        next();
    }
    catch (error) {
        await logger_1.logger.error('route', `Request logging error: ${error.message}`);
        next();
    }
});
// Health check endpoint
router.get('/health', urlShortenerController_1.urlShortenerController.healthCheck.bind(urlShortenerController_1.urlShortenerController));
// Create short URL
router.post('/shorturls', validation_1.validateCreateShortUrl, urlShortenerController_1.urlShortenerController.createShortUrl.bind(urlShortenerController_1.urlShortenerController));
// Get statistics for a shortcode
router.get('/shorturls/:shortcode', validation_1.validateShortcode, urlShortenerController_1.urlShortenerController.getStatistics.bind(urlShortenerController_1.urlShortenerController));
// Redirect to original URL (this should be at the root level, not under /shorturls)
router.get('/:shortcode', validation_1.validateShortcode, urlShortenerController_1.urlShortenerController.redirectToOriginalUrl.bind(urlShortenerController_1.urlShortenerController));
// Error handling middleware
router.use(async (err, _req, res, _next) => {
    try {
        await logger_1.logger.error('route', `Unhandled error: ${err.message}`);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
    catch (logError) {
        console.error('Error in error handler:', logError.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=urlShortenerRoutes.js.map