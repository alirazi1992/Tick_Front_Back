"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingle = exports.uploadMultiple = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../config"));
const appError_1 = require("../utils/appError");
// Ensure upload directory exists
const uploadDir = path_1.default.join(process.cwd(), config_1.default.upload.uploadPath);
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        const basename = path_1.default.basename(file.originalname, ext);
        cb(null, `${basename}-${uniqueSuffix}${ext}`);
    },
});
// File filter
const fileFilter = (_req, file, cb) => {
    // Allowed file types
    const allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'application/zip',
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new appError_1.AppError('Invalid file type. Only images, PDFs, and documents are allowed.', 400));
    }
};
// Configure multer
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: config_1.default.upload.maxFileSize, // Max file size from config
    },
    fileFilter,
});
// Middleware to handle multiple files
exports.uploadMultiple = exports.upload.array('files', 5); // Max 5 files
// Middleware to handle single file
exports.uploadSingle = exports.upload.single('file');
//# sourceMappingURL=upload.js.map