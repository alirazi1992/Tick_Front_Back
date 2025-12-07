import { Router } from 'express';
import {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  addResponse,
  assignTicket,
  getTicketStats,
} from '../controllers/ticketController';
import { protect, restrictTo } from '../middleware/auth';
import { ticketValidation, updateTicketValidation, responseValidation } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(protect);

// Ticket statistics
router.get('/stats', getTicketStats);

// Ticket CRUD operations
router.route('/').get(getTickets).post(ticketValidation, createTicket);

router
  .route('/:id')
  .get(getTicket)
  .put(restrictTo('admin', 'engineer'), updateTicketValidation, updateTicket)
  .delete(restrictTo('admin'), deleteTicket);

// Ticket responses
router.post('/:id/responses', restrictTo('admin', 'engineer'), responseValidation, addResponse);

// Assign ticket to technician
router.put('/:id/assign', restrictTo('admin'), assignTicket);

export default router;
