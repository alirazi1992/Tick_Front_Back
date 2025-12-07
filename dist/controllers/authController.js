"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const appError_1 = require("../utils/appError");
const jwt_1 = require("../utils/jwt");
const logger_1 = __importDefault(require("../utils/logger"));
// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const { name, email, password, phone, department, role } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return next(new appError_1.AppError('User with this email already exists', 400));
        }
        // Create user
        const user = await User_1.default.create({
            name,
            email,
            password,
            phone,
            department,
            role: role || 'client',
        });
        // Generate tokens
        const token = (0, jwt_1.generateToken)(user._id.toString());
        const refreshToken = (0, jwt_1.generateRefreshToken)(user._id.toString());
        logger_1.default.info(`New user registered: ${user.email}`);
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    department: user.department,
                    role: user.role,
                },
                token,
                refreshToken,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const { email, password } = req.body;
        // Check if user exists
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            return next(new appError_1.AppError('Invalid credentials', 401));
        }
        // Check if password matches
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return next(new appError_1.AppError('Invalid credentials', 401));
        }
        // Check if user is active
        if (!user.isActive) {
            return next(new appError_1.AppError('Your account has been deactivated', 401));
        }
        // Generate tokens
        const token = (0, jwt_1.generateToken)(user._id.toString());
        const refreshToken = (0, jwt_1.generateRefreshToken)(user._id.toString());
        logger_1.default.info(`User logged in: ${user.email}`);
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    department: user.department,
                    role: user.role,
                },
                token,
                refreshToken,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new appError_1.AppError('User not found', 404));
        }
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    phone: req.user.phone,
                    department: req.user.department,
                    role: req.user.role,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
// @desc    Update user profile
// @route   PUT /api/v1/auth/updateprofile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new appError_1.AppError('User not found', 404));
        }
        const fieldsToUpdate = {
            name: req.body.name,
            phone: req.body.phone,
            department: req.body.department,
        };
        const user = await User_1.default.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
            new: true,
            runValidators: true,
        });
        logger_1.default.info(`User profile updated: ${user?.email}`);
        res.status(200).json({
            success: true,
            data: { user },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
const updatePassword = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new appError_1.AppError('User not found', 404));
        }
        const user = await User_1.default.findById(req.user._id).select('+password');
        if (!user) {
            return next(new appError_1.AppError('User not found', 404));
        }
        // Check current password
        const isPasswordCorrect = await user.comparePassword(req.body.currentPassword);
        if (!isPasswordCorrect) {
            return next(new appError_1.AppError('Current password is incorrect', 401));
        }
        // Update password
        user.password = req.body.newPassword;
        await user.save();
        // Generate new token
        const token = (0, jwt_1.generateToken)(user._id.toString());
        logger_1.default.info(`Password updated for user: ${user.email}`);
        res.status(200).json({
            success: true,
            data: { token },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePassword = updatePassword;
//# sourceMappingURL=authController.js.map