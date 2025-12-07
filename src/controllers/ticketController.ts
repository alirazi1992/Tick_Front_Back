import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Ticket from '../models/Ticket';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/appError';
import logger from '../utils/logger';

// Generate unique ticket ID
const generateTicketId = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  const ticketId = `TK-${year}-${String(randomNum).padStart(4, '0')}`;

  // Check if ticket ID already exists
  const existingTicket = await Ticket.findOne({ ticketId });
  if (existingTicket) {
    return generateTicketId(); // Recursive call if duplicate
  }

  return ticketId;
};

// @desc    Create new ticket
// @route   POST /api/v1/tickets
// @access  Private
export const createTicket = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (!req.user) {
      return next(new AppError('User not found', 404));
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

    const ticket = await Ticket.create(ticketData);

    logger.info(`New ticket created: ${ticketId} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: { ticket },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tickets
// @route   GET /api/v1/tickets
// @access  Private
export const getTickets = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('User not found', 404));
    }

    let query = {};

    // Role-based filtering
    if (req.user.role === 'client') {
      query = { clientEmail: req.user.email };
    } else if (req.user.role === 'engineer') {
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
      tickets = await Ticket.find({
        ...query,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { ticketId: { $regex: search, $options: 'i' } },
        ],
      }).sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find(query).sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: { tickets },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single ticket
// @route   GET /api/v1/tickets/:id
// @access  Private
export const getTicket = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.id });

    if (!ticket) {
      return next(new AppError('Ticket not found', 404));
    }

    // Check authorization
    if (req.user?.role === 'client' && ticket.clientEmail !== req.user.email) {
      return next(new AppError('Not authorized to access this ticket', 403));
    }

    if (
      req.user?.role === 'engineer' &&
      ticket.assignedTechnicianEmail !== req.user.email
    ) {
      return next(new AppError('Not authorized to access this ticket', 403));
    }

    res.status(200).json({
      success: true,
      data: { ticket },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket
// @route   PUT /api/v1/tickets/:id
// @access  Private (Admin/Engineer)
export const updateTicket = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let ticket = await Ticket.findOne({ ticketId: req.params.id });

    if (!ticket) {
      return next(new AppError('Ticket not found', 404));
    }

    // Engineers can only update tickets assigned to them
    if (
      req.user?.role === 'engineer' &&
      ticket.assignedTechnicianEmail !== req.user.email
    ) {
      return next(new AppError('Not authorized to update this ticket', 403));
    }

    ticket = await Ticket.findOneAndUpdate({ ticketId: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    logger.info(`Ticket updated: ${req.params.id} by ${req.user?.email}`);

    res.status(200).json({
      success: true,
      data: { ticket },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete ticket
// @route   DELETE /api/v1/tickets/:id
// @access  Private (Admin only)
export const deleteTicket = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.id });

    if (!ticket) {
      return next(new AppError('Ticket not found', 404));
    }

    await ticket.deleteOne();

    logger.info(`Ticket deleted: ${req.params.id} by ${req.user?.email}`);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add response to ticket
// @route   POST /api/v1/tickets/:id/responses
// @access  Private (Engineer/Admin)
export const addResponse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const ticket = await Ticket.findOne({ ticketId: req.params.id });

    if (!ticket) {
      return next(new AppError('Ticket not found', 404));
    }

    // Engineers can only respond to tickets assigned to them
    if (
      req.user?.role === 'engineer' &&
      ticket.assignedTechnicianEmail !== req.user.email
    ) {
      return next(new AppError('Not authorized to respond to this ticket', 403));
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

    logger.info(`Response added to ticket: ${req.params.id} by ${req.user?.email}`);

    res.status(200).json({
      success: true,
      data: { ticket },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign ticket to technician
// @route   PUT /api/v1/tickets/:id/assign
// @access  Private (Admin only)
export const assignTicket = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { technicianId, technicianName, technicianEmail } = req.body;

    const ticket = await Ticket.findOne({ ticketId: req.params.id });

    if (!ticket) {
      return next(new AppError('Ticket not found', 404));
    }

    ticket.assignedTo = technicianId;
    ticket.assignedTechnicianName = technicianName;
    ticket.assignedTechnicianEmail = technicianEmail;

    await ticket.save();

    logger.info(`Ticket ${req.params.id} assigned to ${technicianEmail} by ${req.user?.email}`);

    res.status(200).json({
      success: true,
      data: { ticket },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket statistics
// @route   GET /api/v1/tickets/stats
// @access  Private
export const getTicketStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('User not found', 404));
    }

    let matchQuery: any = {};

    // Role-based filtering
    if (req.user.role === 'client') {
      matchQuery = { clientEmail: req.user.email };
    } else if (req.user.role === 'engineer') {
      matchQuery = { assignedTechnicianEmail: req.user.email };
    }

    const stats = await Ticket.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityStats = await Ticket.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    const categoryStats = await Ticket.aggregate([
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
  } catch (error) {
    next(error);
  }
};
