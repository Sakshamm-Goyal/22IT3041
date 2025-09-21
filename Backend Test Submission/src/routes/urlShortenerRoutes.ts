import { Router } from 'express';
import { logger } from '../middleware/logger';
import { urlShortenerController } from '../controllers/urlShortenerController';
import { validateCreateShortUrl, validateShortcode } from '../middleware/validation';

const router = Router();

// Middleware to log all requests
router.use(async (req, _res, next) => {
  try {
    await logger.info('route', `${req.method} ${req.path} - IP: ${req.ip}`);
    next();
  } catch (error) {
    await logger.error('route', `Request logging error: ${(error as Error).message}`);
    next();
  }
});

// Health check endpoint
router.get('/health', urlShortenerController.healthCheck.bind(urlShortenerController));

// Create short URL
router.post(
  '/shorturls',
  validateCreateShortUrl,
  urlShortenerController.createShortUrl.bind(urlShortenerController)
);

// Get statistics for a shortcode
router.get(
  '/shorturls/:shortcode',
  validateShortcode,
  urlShortenerController.getStatistics.bind(urlShortenerController)
);

// Redirect to original URL (this should be at the root level, not under /shorturls)
router.get(
  '/:shortcode',
  validateShortcode,
  urlShortenerController.redirectToOriginalUrl.bind(urlShortenerController)
);

// Error handling middleware
router.use(async (err: Error, _req: any, res: any, _next: any) => {
  try {
    await logger.error('route', `Unhandled error: ${err.message}`);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  } catch (logError) {
    console.error('Error in error handler:', (logError as Error).message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
