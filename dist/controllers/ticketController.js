"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicketStats = exports.assignTicket = exports.addResponse = exports.deleteTicket = exports.updateTicket = exports.getTicket = exports.getTickets = exports.createTicket = void 0;
const express_validator_1 = require("express-validator");
const Ticket_1 = __importDefault(require("../models/Ticket"));
const appError_1 = require("../utils/appError");
const logger_1 = __importDefault(require("../utils/logger"));
// Generate unique ticket ID
const generateTicketId = async () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9999) + 1;
    const ticketId = `TK-${year}-${String(randomNum).padStart(4, '0')}`;
    // Check if ticket ID already exists
    const existingTicket = await Ticket_1.default.findOne({ ticketId });
    if (existingTicket) {
        return generateTicketId(); // Recursive call if duplicate
    }
    return ticketId;
};
// @desc    Create new ticket
// @route   POST /api/v1/tickets
// @access  Private
const createTicket = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        if (!req.user) {
            return next(new appError_1.AppError('User not found', 404));
        }
        const ticketId = await generateTicketId();
        const ticketData = {
            ticketId,
            ...req.body,
            clientName: req.user.name,
            clientEmail: req.user.email,
            clientPhone: req.user.phone,
            department: req.user.department,
        };
        const ticket = await Ticket_1.default.create(ticketData);
        logger_1.default.info(`New ticket created: ${ticketId} by ${req.user.email}`);
        res.status(201).json({
            success: true,
            data: { ticket },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createTicket = createTicket;
// @desc    Get all tickets
// @route   GET /api/v1/tickets
// @access  Private
const getTickets = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new appError_1.AppError('User not found', 404));
        }
        let query = {};
        // Role-based filtering
        if (req.user.role === 'client') {
            query = { clientEmail: req.user.email };
        }
        else if (req.user.role === 'engineer') {
            query = { assignedTechnicianEmail: req.user.email };
        }
        // Admin can see all tickets
        // Additional filters from query params
        const { status, priority, category, search } = req.query;
        if (status) {
            query = { ...query, status };
        }
        if (priority) {
            query = { ...query, priority };
        }
        if (category) {
            query = { ...query, category };
        }
        let tickets;
        if (search) {
            tickets = await Ticket_1.default.find({
                ...query,
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { ticketId: { $regex: search, $options: 'i' } },
                ],
            }).sort({ createdAt: -1 });
        }
        else {
            tickets = await Ticket_1.default.find(query).sort({ createdAt: -1 });
        }
        res.status(200).json({
            success: true,
            count: tickets.length,
            data: { tickets },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getTickets = getTickets;
// @desc    Get single ticket
// @route   GET /api/v1/tickets/:id
// @access  Private
const getTicket = async (req, res, next) => {
    try {
        const ticket = await Ticket_1.default.findOne({ ticketId: req.params.id });
        if (!ticket) {
            return next(new appError_1.AppError('Ticket not found', 404));
        }
        // Check authorization
        if (req.user?.role === 'client' && ticket.clientEmail !== req.user.email) {
            return next(new appError_1.AppError('Not authorized to access this ticket', 403));
        }
        if (req.user?.role === 'engineer' &&
            ticket.assignedTechnicianEmail !== req.user.email) {
            return next(new appError_1.AppError('Not authorized to access this ticket', 403));
        }
        res.status(200).json({
            success: true,
            data: { ticket },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getTicket = getTicket;
// @desc    Update ticket
// @route   PUT /api/v1/tickets/:id
// @access  Private (Admin/Engineer)
const updateTicket = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        let ticket = await Ticket_1.default.findOne({ ticketId: req.params.id });
        if (!ticket) {
            return next(new appError_1.AppError('Ticket not found', 404));
        }
        // Engineers can only update tickets assigned to them
        if (req.user?.role === 'engineer' &&
            ticket.assignedTechnicianEmail !== req.user.email) {
            return next(new appError_1.AppError('Not authorized to update this ticket', 403));
        }
        ticket = await Ticket_1.default.findOneAndUpdate({ ticketId: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        });
        logger_1.default.info(`Ticket updated: ${req.params.id} by ${req.user?.email}`);
        res.status(200).json({
            success: true,
            data: { ticket },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTicket = updateTicket;
// @desc    Delete ticket
// @route   DELETE /api/v1/tickets/:id
// @access  Private (Admin only)
const deleteTicket = async (req, res, next) => {
    try {
        const ticket = await Ticket_1.default.findOne({ ticketId: req.params.id });
        if (!ticket) {
            return next(new appError_1.AppError('Ticket not found', 404));
        }
        await ticket.deleteOne();
        logger_1.default.info(`Ticket deleted: ${req.params.id} by ${req.user?.email}`);
        res.status(200).json({
            success: true,
            data: {},
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTicket = deleteTicket;
// @desc    Add response to ticket
// @route   POST /api/v1/tickets/:id/responses
// @access  Private (Engineer/Admin)
const addResponse = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const ticket = await Ticket_1.default.findOne({ ticketId: req.params.id });
        if (!ticket) {
            return next(new appError_1.AppError('Ticket not found', 404));
        }
        // Engineers can only respond to tickets assigned to them
        if (req.user?.role === 'engineer' &&
            ticket.assignedTechnicianEmail !== req.user.email) {
            return next(new appError_1.AppError('Not authorized to respond to this ticket', 403));
        }
        const response = {
            message: req.body.message,
            status: req.body.status,
            technicianName: req.user?.name,
            technicianEmail: req.user?.email,
            timestamp: new Date(),
        };
        ticket.responses.push(response);
        ticket.status = req.body.status;
        ticket.lastResponseBy = req.user?.name;
        ticket.lastResponseAt = new Date();
        await ticket.save();
        logger_1.default.info(`Response added to ticket: ${req.params.id} by ${req.user?.email}`);
        res.status(200).json({
            success: true,
            data: { ticket },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addResponse = addResponse;
// @desc    Assign ticket to technician
// @route   PUT /api/v1/tickets/:id/assign
// @access  Private (Admin only)
const assignTicket = async (req, res, next) => {
    try {
        const { technicianId, technicianName, technicianEmail } = req.body;
        const ticket = await Ticket_1.default.findOne({ ticketId: req.params.id });
        if (!ticket) {
            return next(new appError_1.AppError('Ticket not found', 404));
        }
        ticket.assignedTo = technicianId;
        ticket.assignedTechnicianName = technicianName;
        ticket.assignedTechnicianEmail = technicianEmail;
        await ticket.save();
        logger_1.default.info(`Ticket ${req.params.id} assigned to ${technicianEmail} by ${req.user?.email}`);
        res.status(200).json({
            success: true,
            data: { ticket },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.assignTicket = assignTicket;
// @desc    Get ticket statistics
// @route   GET /api/v1/tickets/stats
// @access  Private
const getTicketStats = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new appError_1.AppError('User not found', 404));
        }
        let matchQuery = {};
        // Role-based filtering
        if (req.user.role === 'client') {
            matchQuery = { clientEmail: req.user.email };
        }
        else if (req.user.role === 'engineer') {
            matchQuery = { assignedTechnicianEmail: req.user.email };
        }
        const stats = await Ticket_1.default.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);
        const priorityStats = await Ticket_1.default.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 },
                },
            },
        ]);
        const categoryStats = await Ticket_1.default.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json({
            success: true,
            data: {
                statusStats: stats,
                priorityStats,
                categoryStats,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getTicketStats = getTicketStats;
//# sourceMappingURL=ticketController.js.map