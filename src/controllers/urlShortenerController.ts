import { Request, Response } from 'express';
import { logger } from '../middleware/logger';
import { urlShortenerService } from '../services/urlShortenerService';
import { ApiError } from '../types';

export class UrlShortenerController {
  /**
   * Create a new short URL
   */
  async createShortUrl(req: Request, res: Response): Promise<void> {
    try {
      await logger.info('controller', `Creating short URL for: ${req.body.url || 'unknown'}`);

      const result = await urlShortenerService.createShortUrl(req.body);

      await logger.info('controller', `Short URL created successfully: ${result.shortLink}`);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      await logger.error('controller', `Error creating short URL: ${errorMessage}`);

      let statusCode = 500;
      let message = 'Internal server error while creating short URL';

      if (errorMessage === 'Invalid URL format') {
        statusCode = 400;
        message = 'Invalid URL format. Please provide a valid HTTP or HTTPS URL';
      } else if (errorMessage.includes('shortcode')) {
        statusCode = 409;
        message = errorMessage;
      }

      const response: ApiError = {
        success: false,
        message,
      };

      res.status(statusCode).json(response);
    }
  }

  /**
   * Redirect to original URL
   */
  async redirectToOriginalUrl(req: Request, res: Response): Promise<void> {
    try {
      const { shortcode } = req.params;

      await logger.info('controller', `Redirecting shortcode: ${shortcode}`);

      const originalUrl = await urlShortenerService.getOriginalUrl(shortcode || '');

      if (!originalUrl) {
        await logger.warn('controller', `Shortcode not found or expired: ${shortcode}`);
        const response: ApiError = {
          success: false,
          message: 'Short URL not found or has expired',
        };
        res.status(404).json(response);
        return;
      }

      await logger.info('controller', `Redirecting to: ${originalUrl}`);

      res.redirect(302, originalUrl);
    } catch (error) {
      await logger.error('controller', `Error redirecting: ${(error as Error).message}`);

      const response: ApiError = {
        success: false,
        message: 'Internal server error while redirecting',
      };

      res.status(500).json(response);
    }
  }

  /**
   * Get statistics for a shortcode
   */
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const { shortcode } = req.params;

      await logger.info('controller', `Getting statistics for shortcode: ${shortcode || 'unknown'}`);

      const statistics = await urlShortenerService.getStatistics(shortcode || '');

      if (!statistics) {
        await logger.warn('controller', `Statistics not found for shortcode: ${shortcode}`);
        const response: ApiError = {
          success: false,
          message: 'Short URL not found',
        };
        res.status(404).json(response);
        return;
      }

      await logger.info('controller', `Statistics retrieved for shortcode: ${shortcode}`);

      res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      await logger.error('controller', `Error getting statistics: ${(error as Error).message}`);

      const response: ApiError = {
        success: false,
        message: 'Internal server error while retrieving statistics',
      };

      res.status(500).json(response);
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(_req: Request, res: Response): Promise<void> {
    try {
      await logger.info('controller', 'Health check requested');

      res.status(200).json({
        success: true,
        message: 'URL Shortener Service is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    } catch (error) {
      await logger.error('controller', `Health check error: ${(error as Error).message}`);

      const response: ApiError = {
        success: false,
        message: 'Service unhealthy',
      };

      res.status(500).json(response);
    }
  }
}

// Create singleton instance
export const urlShortenerController = new UrlShortenerController();
