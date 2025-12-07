"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseValidation = exports.updateTicketValidation = exports.ticketValidation = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('role')
        .optional()
        .isIn(['client', 'engineer', 'admin'])
        .withMessage('Invalid role'),
];
exports.loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
exports.ticketValidation = [
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('description').trim().notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('priority')
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Invalid priority'),
    (0, express_validator_1.body)('category').trim().notEmpty().withMessage('Category is required'),
];
exports.updateTicketValidation = [
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['open', 'in-progress', 'resolved', 'closed'])
        .withMessage('Invalid status'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Invalid priority'),
];
exports.responseValidation = [
    (0, express_validator_1.body)('message').trim().notEmpty().withMessage('Message is required'),
    (0, express_validator_1.body)('status')
        .isIn(['open', 'in-progress', 'resolved', 'closed'])
        .withMessage('Invalid status'),
];
//# sourceMappingURL=validation.js.map