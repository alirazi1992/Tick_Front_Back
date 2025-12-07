"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("./config"));
const database_1 = __importDefault(require("./config/database"));
const logger_1 = __importDefault(require("./utils/logger"));
const errorHandler_1 = require("./middleware/errorHandler");
// Route imports
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
// Import seed function
const seed_1 = require("./utils/seed");
const app = (0, express_1.default)();
// Connect to database
(0, database_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
// CORS
app.use((0, cors_1.default)({
    origin: config_1.default.cors.allowedOrigins,
    credentials: true,
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.default.rateLimit.windowMs,
    max: config_1.default.rateLimit.maxRequests,
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);
// Body parser
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Compression
app.use((0, compression_1.default)());
// Logging
if (config_1.default.env === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined', {
        stream: {
            write: (message) => logger_1.default.info(message.trim()),
        },
    }));
}
// Static files
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), config_1.default.upload.uploadPath)));
// Mount routes
app.use(`${config_1.default.apiPrefix}/auth`, authRoutes_1.default);
app.use(`${config_1.default.apiPrefix}/tickets`, ticketRoutes_1.default);
app.use(`${config_1.default.apiPrefix}/categories`, categoryRoutes_1.default);
app.use(`${config_1.default.apiPrefix}/upload`, uploadRoutes_1.default);
// Health check route
app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});
// Root route
app.get('/', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'IT Ticketing System API',
        version: '1.0.0',
        apiPrefix: config_1.default.apiPrefix,
    });
});
// Error handling middleware (must be last)
app.use(errorHandler_1.errorHandler);
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger_1.default.error(`Unhandled Rejection: ${err.message}`);
    logger_1.default.error(err.stack);
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger_1.default.error(`Uncaught Exception: ${err.message}`);
    logger_1.default.error(err.stack);
    process.exit(1);
});
const PORT = config_1.default.port || 5000;
const server = app.listen(PORT, async () => {
    logger_1.default.info(`Server running in ${config_1.default.env} mode on port ${PORT}`);
    logger_1.default.info(`API available at http://localhost:${PORT}${config_1.default.apiPrefix}`);
    // Seed database with initial data
    try {
        await (0, seed_1.seedDatabase)();
    }
    catch (error) {
        logger_1.default.error('Error seeding database:', error);
    }
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger_1.default.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger_1.default.info('HTTP server closed');
    });
});
exports.default = app;
//# sourceMappingURL=server.js.map