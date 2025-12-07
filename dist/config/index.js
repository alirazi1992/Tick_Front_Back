"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    apiPrefix: process.env.API_PREFIX || '/api/v1',
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ticketing_system',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expire: process.env.JWT_EXPIRE || '7d',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
        refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    },
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB default
        uploadPath: process.env.UPLOAD_PATH || 'uploads',
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
    admin: {
        email: process.env.ADMIN_EMAIL || 'admin@company.com',
        password: process.env.ADMIN_PASSWORD || '123456',
        name: process.env.ADMIN_NAME || 'مدیر سیستم',
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
    },
};
exports.default = config;
//# sourceMappingURL=index.js.map