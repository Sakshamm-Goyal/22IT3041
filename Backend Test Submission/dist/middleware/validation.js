"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateShortcode = exports.validateCreateShortUrl = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = require("./logger");
const createShortUrlSchema = joi_1.default.object({
    url: joi_1.default.string()
        .uri({ scheme: ['http', 'https'] })
        .required()
        .messages({
        'string.uri': 'URL must be a valid HTTP or HTTPS URL',
        'any.required': 'URL is required',
    }),
    validity: joi_1.default.number()
        .integer()
        .min(1)
        .max(525600) // Max 1 year in minutes
        .optional()
        .messages({
        'number.base': 'Validity must be a number',
        'number.integer': 'Validity must be an integer',
        'number.min': 'Validity must be at least 1 minute',
        'number.max': 'Validity cannot exceed 1 year',
    }),
    shortcode: joi_1.default.string()
        .pattern(/^[a-zA-Z0-9]{4,20}$/)
        .optional()
        .messages({
        'string.pattern.base': 'Shortcode must be 4-20 characters long and contain only alphanumeric characters',
    }),
});
const validateCreateShortUrl = async (req, res, next) => {
    try {
        await logger_1.logger.debug('middleware', 'Validating create short URL request');
        const { error, value } = createShortUrlSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const errorMessages = error.details.map((detail) => detail.message);
            await logger_1.logger.warn('middleware', `Validation failed: ${errorMessages.join(', ')}`);
            const response = {
                success: false,
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
            };
            res.status(400).json(response);
            return;
        }
        req.body = value;
        await logger_1.logger.info('middleware', 'Create short URL request validation successful');
        next();
    }
    catch (err) {
        await logger_1.logger.error('middleware', `Validation middleware error: ${err.message}`);
        const response = {
            success: false,
            message: 'Internal server error during validation',
        };
        res.status(500).json(response);
    }
};
exports.validateCreateShortUrl = validateCreateShortUrl;
const validateShortcode = async (req, res, next) => {
    try {
        const { shortcode } = req.params;
        await logger_1.logger.debug('middleware', `Validating shortcode: ${shortcode}`);
        if (!shortcode) {
            await logger_1.logger.warn('middleware', 'Missing shortcode parameter');
            const response = {
                success: false,
                message: 'Shortcode parameter is required',
            };
            res.status(400).json(response);
            return;
        }
        const shortcodeRegex = /^[a-zA-Z0-9]{4,20}$/;
        if (!shortcodeRegex.test(shortcode)) {
            await logger_1.logger.warn('middleware', `Invalid shortcode format: ${shortcode}`);
            const response = {
                success: false,
                message: 'Invalid shortcode format. Must be 4-20 alphanumeric characters',
            };
            res.status(400).json(response);
            return;
        }
        await logger_1.logger.info('middleware', 'Shortcode validation successful');
        next();
    }
    catch (err) {
        await logger_1.logger.error('middleware', `Shortcode validation error: ${err.message}`);
        const response = {
            success: false,
            message: 'Internal server error during validation',
        };
        res.status(500).json(response);
    }
};
exports.validateShortcode = validateShortcode;
//# sourceMappingURL=validation.js.map