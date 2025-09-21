import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from './logger';
import { ApiError } from '../types';

const createShortUrlSchema = Joi.object({
  url: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required()
    .messages({
      'string.uri': 'URL must be a valid HTTP or HTTPS URL',
      'any.required': 'URL is required',
    }),
  validity: Joi.number()
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
  shortcode: Joi.string()
    .pattern(/^[a-zA-Z0-9]{4,20}$/)
    .optional()
    .messages({
      'string.pattern.base':
        'Shortcode must be 4-20 characters long and contain only alphanumeric characters',
    }),
});

export const validateCreateShortUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await logger.debug('middleware', 'Validating create short URL request');

    const { error, value } = createShortUrlSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      await logger.warn('middleware', `Validation failed: ${errorMessages.join(', ')}`);

      const response: ApiError = {
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
      };

      res.status(400).json(response);
      return;
    }

    req.body = value;
    await logger.info('middleware', 'Create short URL request validation successful');
    next();
  } catch (err) {
    await logger.error('middleware', `Validation middleware error: ${(err as Error).message}`);
    const response: ApiError = {
      success: false,
      message: 'Internal server error during validation',
    };
    res.status(500).json(response);
  }
};

export const validateShortcode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { shortcode } = req.params;

    await logger.debug('middleware', `Validating shortcode: ${shortcode}`);

    if (!shortcode) {
      await logger.warn('middleware', 'Missing shortcode parameter');
      const response: ApiError = {
        success: false,
        message: 'Shortcode parameter is required',
      };
      res.status(400).json(response);
      return;
    }

    const shortcodeRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!shortcodeRegex.test(shortcode)) {
      await logger.warn('middleware', `Invalid shortcode format: ${shortcode}`);
      const response: ApiError = {
        success: false,
        message: 'Invalid shortcode format. Must be 4-20 alphanumeric characters',
      };
      res.status(400).json(response);
      return;
    }

    await logger.info('middleware', 'Shortcode validation successful');
    next();
  } catch (err) {
    await logger.error('middleware', `Shortcode validation error: ${(err as Error).message}`);
    const response: ApiError = {
      success: false,
      message: 'Internal server error during validation',
    };
    res.status(500).json(response);
  }
};
