import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createTicket: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const getTickets: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getTicket: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateTicket: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const deleteTicket: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const addResponse: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const assignTicket: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getTicketStats: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=ticketController.d.ts.map