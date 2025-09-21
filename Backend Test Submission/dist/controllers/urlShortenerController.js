"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlShortenerController = exports.UrlShortenerController = void 0;
const logger_1 = require("../middleware/logger");
const urlShortenerService_1 = require("../services/urlShortenerService");
class UrlShortenerController {
    /**
     * Create a new short URL
     */
    async createShortUrl(req, res) {
        try {
            await logger_1.logger.info('controller', `Creating short URL for: ${req.body.url || 'unknown'}`);
            const result = await urlShortenerService_1.urlShortenerService.createShortUrl(req.body);
            await logger_1.logger.info('controller', `Short URL created successfully: ${result.shortLink}`);
            res.status(201).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            const errorMessage = error.message;
            await logger_1.logger.error('controller', `Error creating short URL: ${errorMessage}`);
            let statusCode = 500;
            let message = 'Internal server error while creating short URL';
            if (errorMessage === 'Invalid URL format') {
                statusCode = 400;
                message = 'Invalid URL format. Please provide a valid HTTP or HTTPS URL';
            }
            else if (errorMessage.includes('shortcode') || errorMessage.includes('Shortcode')) {
                statusCode = 409;
                message = errorMessage;
            }
            else if (errorMessage.includes('Invalid shortcode format')) {
                statusCode = 400;
                message = errorMessage;
            }
            const response = {
                success: false,
                message,
            };
            res.status(statusCode).json(response);
        }
    }
    /**
     * Redirect to original URL
     */
    async redirectToOriginalUrl(req, res) {
        try {
            const { shortcode } = req.params;
            await logger_1.logger.info('controller', `Redirecting shortcode: ${shortcode}`);
            const originalUrl = await urlShortenerService_1.urlShortenerService.getOriginalUrl(shortcode || '');
            if (!originalUrl) {
                await logger_1.logger.warn('controller', `Shortcode not found or expired: ${shortcode}`);
                const response = {
                    success: false,
                    message: 'Short URL not found or has expired',
                };
                res.status(404).json(response);
                return;
            }
            await logger_1.logger.info('controller', `Redirecting to: ${originalUrl}`);
            res.redirect(302, originalUrl);
        }
        catch (error) {
            await logger_1.logger.error('controller', `Error redirecting: ${error.message}`);
            const response = {
                success: false,
                message: 'Internal server error while redirecting',
            };
            res.status(500).json(response);
        }
    }
    /**
     * Get statistics for a shortcode
     */
    async getStatistics(req, res) {
        try {
            const { shortcode } = req.params;
            await logger_1.logger.info('controller', `Getting statistics for shortcode: ${shortcode || 'unknown'}`);
            const statistics = await urlShortenerService_1.urlShortenerService.getStatistics(shortcode || '');
            if (!statistics) {
                await logger_1.logger.warn('controller', `Statistics not found for shortcode: ${shortcode}`);
                const response = {
                    success: false,
                    message: 'Short URL not found',
                };
                res.status(404).json(response);
                return;
            }
            await logger_1.logger.info('controller', `Statistics retrieved for shortcode: ${shortcode}`);
            res.status(200).json({
                success: true,
                data: statistics,
            });
        }
        catch (error) {
            await logger_1.logger.error('controller', `Error getting statistics: ${error.message}`);
            const response = {
                success: false,
                message: 'Internal server error while retrieving statistics',
            };
            res.status(500).json(response);
        }
    }
    /**
     * Health check endpoint
     */
    async healthCheck(_req, res) {
        try {
            await logger_1.logger.info('controller', 'Health check requested');
            res.status(200).json({
                success: true,
                message: 'URL Shortener Service is healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
            });
        }
        catch (error) {
            await logger_1.logger.error('controller', `Health check error: ${error.message}`);
            const response = {
                success: false,
                message: 'Service unhealthy',
            };
            res.status(500).json(response);
        }
    }
}
exports.UrlShortenerController = UrlShortenerController;
// Create singleton instance
exports.urlShortenerController = new UrlShortenerController();
//# sourceMappingURL=urlShortenerController.js.map