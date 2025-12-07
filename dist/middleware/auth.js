"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const User_1 = __importDefault(require("../models/User"));
const appError_1 = require("../utils/appError");
const protect = async (req, _res, next) => {
    try {
        let token;
        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new appError_1.AppError('Not authorized to access this route', 401));
        }
        try {
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
            // Get user from token
            const user = await User_1.default.findById(decoded.id).select('+password');
            if (!user) {
                return next(new appError_1.AppError('User not found', 404));
            }
            if (!user.isActive) {
                return next(new appError_1.AppError('User account is deactivated', 401));
            }
            req.user = user;
            next();
        }
        catch (error) {
            return next(new appError_1.AppError('Invalid token', 401));
        }
    }
    catch (error) {
        next(error);
    }
};
exports.protect = protect;
// Middleware to restrict access based on user roles
const restrictTo = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new appError_1.AppError('Not authorized', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new appError_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
//# sourceMappingURL=auth.js.map