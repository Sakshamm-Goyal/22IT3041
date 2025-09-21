"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("./config");
const logger_1 = require("./middleware/logger");
const urlShortenerRoutes_1 = __importDefault(require("./routes/urlShortenerRoutes"));
const urlShortenerService_1 = require("./services/urlShortenerService");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // Disable for development
    crossOriginEmbedderPolicy: false,
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: config_1.config.nodeEnv === 'production' ? false : true,
    credentials: true,
}));
// Compression middleware
app.use((0, compression_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
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
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Static files for frontend
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Request logging middleware
app.use(async (req, _res, next) => {
    try {
        await logger_1.logger.info('middleware', `Incoming request: ${req.method} ${req.originalUrl} from ${req.ip}`);
        next();
    }
    catch (error) {
        console.error('Request logging error:', error.message);
        next();
    }
});
// Serve frontend
app.get('/', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
// API routes
app.use('/api', urlShortenerRoutes_1.default);
// Root redirect route (for short URLs) - must be after API routes
// Exclude common paths that shouldn't be treated as shortcodes
app.get('/:shortcode', (req, res, next) => {
    const { shortcode } = req.params;
    // Exclude common paths that shouldn't be shortcodes
    const excludedPaths = ['favicon.ico', 'robots.txt', 'sitemap.xml', 'service-worker.js', 'manifest.json'];
    if (shortcode && excludedPaths.includes(shortcode)) {
        res.status(404).json({
            success: false,
            message: 'Not found'
        });
        return;
    }
    // Continue to shortcode handler
    next();
}, urlShortenerRoutes_1.default);
// 404 handler
app.use('*', async (req, res) => {
    try {
        await logger_1.logger.warn('middleware', `404 - Route not found: ${req.originalUrl}`);
        res.status(404).json({
            success: false,
            message: 'Route not found',
        });
    }
    catch (error) {
        console.error('404 handler error:', error.message);
        res.status(404).json({
            success: false,
            message: 'Route not found',
        });
    }
});
// Global error handler
app.use(async (err, _req, res, _next) => {
    try {
        await logger_1.logger.error('middleware', `Global error: ${err.message}`);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
    catch (logError) {
        console.error('Global error handler failed:', logError.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Cleanup expired URLs every hour
setInterval(async () => {
    try {
        await urlShortenerService_1.urlShortenerService.cleanupExpiredUrls();
    }
    catch (error) {
        await logger_1.logger.error('service', `Cleanup job failed: ${error.message}`);
    }
}, 60 * 60 * 1000); // 1 hour
// Graceful shutdown
process.on('SIGTERM', async () => {
    await logger_1.logger.info('service', 'SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', async () => {
    await logger_1.logger.info('service', 'SIGINT received, shutting down gracefully');
    process.exit(0);
});
// Start server
async function startServer() {
    try {
        const PORT = config_1.config.port;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${config_1.config.nodeEnv}`);
            console.log(`Frontend available at: http://localhost:${PORT}`);
            console.log(`API available at: http://localhost:${PORT}/api`);
        });
        await logger_1.logger.info('service', `Server started on port ${PORT}`);
    }
    catch (error) {
        await logger_1.logger.fatal('service', `Server startup failed: ${error.message}`);
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map