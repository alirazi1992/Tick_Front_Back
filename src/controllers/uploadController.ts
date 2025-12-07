import { Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/appError';
import config from '../config';
import logger from '../utils/logger';

// @desc    Upload files
// @route   POST /api/v1/upload
// @access  Private
export const uploadFiles = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return next(new AppError('No files uploaded', 400));
    }

    const files = Array.isArray(req.files) ? req.files : [req.files];

    const uploadedFiles = files.map((file: any) => ({
      name: file.originalname,
      url: `/uploads/${file.filename}`,
      size: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date(),
    }));

    logger.info(`Files uploaded by ${req.user?.email}: ${uploadedFiles.length} files`);

    res.status(200).json({
      success: true,
      data: { files: uploadedFiles },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete file
// @route   DELETE /api/v1/upload/:filename
// @access  Private
export const deleteFile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { filename } = req.params;

    const filePath = path.join(process.cwd(), config.upload.uploadPath, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return next(new AppError('File not found', 404));
    }

    // Delete file
    fs.unlinkSync(filePath);

    logger.info(`File deleted by ${req.user?.email}: ${filename}`);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
