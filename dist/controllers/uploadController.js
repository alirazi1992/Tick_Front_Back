"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.uploadFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const appError_1 = require("../utils/appError");
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../utils/logger"));
// @desc    Upload files
// @route   POST /api/v1/upload
// @access  Private
const uploadFiles = async (req, res, next) => {
    try {
        if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
            return next(new appError_1.AppError('No files uploaded', 400));
        }
        const files = Array.isArray(req.files) ? req.files : [req.files];
        const uploadedFiles = files.map((file) => ({
            name: file.originalname,
            url: `/uploads/${file.filename}`,
            size: file.size,
            mimeType: file.mimetype,
            uploadedAt: new Date(),
        }));
        logger_1.default.info(`Files uploaded by ${req.user?.email}: ${uploadedFiles.length} files`);
        res.status(200).json({
            success: true,
            data: { files: uploadedFiles },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadFiles = uploadFiles;
// @desc    Delete file
// @route   DELETE /api/v1/upload/:filename
// @access  Private
const deleteFile = async (req, res, next) => {
    try {
        const { filename } = req.params;
        const filePath = path_1.default.join(process.cwd(), config_1.default.upload.uploadPath, filename);
        // Check if file exists
        if (!fs_1.default.existsSync(filePath)) {
            return next(new appError_1.AppError('File not found', 404));
        }
        // Delete file
        fs_1.default.unlinkSync(filePath);
        logger_1.default.info(`File deleted by ${req.user?.email}: ${filename}`);
        res.status(200).json({
            success: true,
            data: {},
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteFile = deleteFile;
//# sourceMappingURL=uploadController.js.map