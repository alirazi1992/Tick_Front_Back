import mongoose, { Document } from 'mongoose';
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export interface ITicketResponse {
    message: string;
    status: TicketStatus;
    technicianName?: string;
    technicianEmail?: string;
    timestamp: Date;
}
export interface IAttachment {
    name: string;
    url: string;
    size: number;
    mimeType: string;
    uploadedAt: Date;
}
export interface ITicket extends Document {
    ticketId: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    category: string;
    subCategory?: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    department?: string;
    assignedTo?: mongoose.Types.ObjectId;
    assignedTechnicianName?: string;
    assignedTechnicianEmail?: string;
    responses: ITicketResponse[];
    attachments: IAttachment[];
    dynamicFields?: Record<string, any>;
    lastResponseBy?: string;
    lastResponseAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ITicket, {}, {}, {}, mongoose.Document<unknown, {}, ITicket, {}, {}> & ITicket & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Ticket.d.ts.map