"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlShortenerService = exports.UrlShortenerService = void 0;
const shortid_1 = __importDefault(require("shortid"));
const logger_1 = require("../middleware/logger");
const sqlite_1 = require("../database/sqlite");
const config_1 = require("../config");
class UrlShortenerService {
    constructor() {
        this.baseUrl = config_1.config.baseUrl;
    }
    /**
     * Create a new short URL
     */
    async createShortUrl(urlData) {
        try {
            await logger_1.logger.info('service', `Creating short URL for: ${urlData.url}`);
            // Validate URL
            if (!this.isValidUrl(urlData.url)) {
                await logger_1.logger.error('service', `Invalid URL provided: ${urlData.url}`);
                throw new Error('Invalid URL format');
            }
            // Generate or validate shortcode
            let shortcode = urlData.shortcode;
            if (shortcode) {
                if (!this.isValidShortcode(shortcode)) {
                    await logger_1.logger.error('service', `Invalid shortcode format: ${shortcode}`);
                    throw new Error('Invalid shortcode format. Must be alphanumeric, 4-20 characters');
                }
                const isAvailable = await sqlite_1.database.isShortcodeAvailable(shortcode);
                if (!isAvailable) {
                    await logger_1.logger.error('service', `Shortcode already exists: ${shortcode}`);
                    throw new Error('Shortcode already exists');
                }
            }
            else {
                shortcode = await this.generateUniqueShortcode();
                await logger_1.logger.info('service', `Generated shortcode: ${shortcode}`);
            }
            // Calculate expiry
            const validityMinutes = urlData.validity || 30;
            const expiry = new Date(Date.now() + validityMinutes * 60 * 1000);
            // Create short link
            const shortLink = `${this.baseUrl}/${shortcode}`;
            // Save to database
            await sqlite_1.database.createShortUrl(shortcode, urlData.url, expiry.toISOString());
            await logger_1.logger.info('service', `Short URL created successfully: ${shortLink}`);
            return {
                shortLink,
                expiry: expiry.toISOString(),
            };
        }
        catch (error) {
            await logger_1.logger.error('service', `Error creating short URL: ${error.message}`);
            throw error;
        }
    }
    /**
     * Get original URL and track click
     */
    async getOriginalUrl(shortcode) {
        try {
            await logger_1.logger.info('service', `Retrieving original URL for shortcode: ${shortcode}`);
            const urlData = await sqlite_1.database.getShortUrl(shortcode);
            if (!urlData) {
                await logger_1.logger.warn('service', `Shortcode not found or expired: ${shortcode}`);
                return null;
            }
            // Track click
            const clickData = {
                referrer: 'direct',
                geoLocation: JSON.stringify({
                    country: 'Unknown',
                    city: 'Unknown',
                    region: 'Unknown',
                }),
            };
            await sqlite_1.database.addClick(shortcode, clickData.referrer, clickData.geoLocation);
            await logger_1.logger.info('service', `Redirecting to original URL: ${urlData.originalUrl}`);
            return urlData.originalUrl;
        }
        catch (error) {
            await logger_1.logger.error('service', `Error retrieving original URL: ${error.message}`);
            throw error;
        }
    }
    /**
     * Get statistics for a shortcode
     */
    async getStatistics(shortcode) {
        try {
            await logger_1.logger.info('service', `Retrieving statistics for shortcode: ${shortcode}`);
            const urlData = await sqlite_1.database.getShortUrl(shortcode);
            if (!urlData) {
                await logger_1.logger.warn('service', `Shortcode not found for statistics: ${shortcode}`);
                return null;
            }
            const clickDetails = await sqlite_1.database.getClickDetails(shortcode);
            const clicksDetail = clickDetails.map((click) => ({
                timestamp: click.timestamp,
                referrer: click.referrer,
                geoLocation: JSON.parse(click.geoLocation),
            }));
            const statistics = {
                clicks: urlData.clicks,
                originalURL: urlData.originalUrl,
                creationDate: urlData.createdAt,
                expiry: urlData.expiry,
                clicksDetail,
            };
            await logger_1.logger.info('service', `Statistics retrieved for shortcode: ${shortcode}, total clicks: ${urlData.clicks}`);
            return statistics;
        }
        catch (error) {
            await logger_1.logger.error('service', `Error retrieving statistics: ${error.message}`);
            throw error;
        }
    }
    /**
     * Generate a unique shortcode
     */
    async generateUniqueShortcode() {
        let shortcode;
        let attempts = 0;
        const maxAttempts = 10;
        do {
            shortcode = shortid_1.default.generate();
            attempts++;
            if (attempts >= maxAttempts) {
                await logger_1.logger.error('service', 'Failed to generate unique shortcode after maximum attempts');
                throw new Error('Failed to generate unique shortcode');
            }
        } while (!(await sqlite_1.database.isShortcodeAvailable(shortcode)));
        return shortcode;
    }
    /**
     * Validate URL format
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return url.startsWith('http://') || url.startsWith('https://');
        }
        catch {
            return false;
        }
    }
    /**
     * Validate shortcode format
     */
    isValidShortcode(shortcode) {
        const regex = /^[a-zA-Z0-9]{4,20}$/;
        return regex.test(shortcode);
    }
    /**
     * Cleanup expired URLs
     */
    async cleanupExpiredUrls() {
        try {
            await sqlite_1.database.cleanupExpiredUrls();
        }
        catch (error) {
            await logger_1.logger.error('service', `Cleanup job failed: ${error.message}`);
        }
    }
}
exports.UrlShortenerService = UrlShortenerService;
// Create singleton instance
exports.urlShortenerService = new UrlShortenerService();
//# sourceMappingURL=urlShortenerService.js.map