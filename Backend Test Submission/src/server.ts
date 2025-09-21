import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';

import { config } from './config';
import { logger } from './middleware/logger';
import urlShortenerRoutes from './routes/urlShortenerRoutes';
import { urlShortenerService } from './services/urlShortenerService';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for development
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: config.nodeEnv === 'production' ? false : true,
    credentials: true,
  })
);

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for frontend
app.use(express.static(path.join(__dirname, '../public')));

// Request logging middleware
app.use(async (req, _res, next) => {
  try {
    await logger.info('middleware', `Incoming request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    next();
  } catch (error) {
    console.error('Request logging error:', (error as Error).message);
    next();
  }
});

// API routes
app.use('/api', urlShortenerRoutes);

// Root redirect route (for short URLs)
app.get('/:shortcode', urlShortenerRoutes);

// Serve frontend
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 handler
app.use('*', async (req, res) => {
  try {
    await logger.warn('middleware', `404 - Route not found: ${req.originalUrl}`);
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  } catch (error) {
    console.error('404 handler error:', (error as Error).message);
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  }
});

// Global error handler
app.use(async (err: Error, _req: any, res: any, _next: any) => {
  try {
    await logger.error('middleware', `Global error: ${err.message}`);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  } catch (logError) {
    console.error('Global error handler failed:', (logError as Error).message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Cleanup expired URLs every hour
setInterval(async () => {
  try {
    await urlShortenerService.cleanupExpiredUrls();
  } catch (error) {
    await logger.error('service', `Cleanup job failed: ${(error as Error).message}`);
  }
}, 60 * 60 * 1000); // 1 hour

// Graceful shutdown
process.on('SIGTERM', async () => {
  await logger.info('service', 'SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  await logger.info('service', 'SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
async function startServer(): Promise<void> {
  try {
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`Frontend available at: http://localhost:${PORT}`);
      console.log(`API available at: http://localhost:${PORT}/api`);
    });

    await logger.info('service', `Server started on port ${PORT}`);
  } catch (error) {
    await logger.fatal('service', `Server startup failed: ${(error as Error).message}`);
    console.error('Server startup failed:', (error as Error).message);
    process.exit(1);
  }
}

startServer();
