import mongoose, { Document, Schema } from 'mongoose';

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

const ticketResponseSchema = new Schema<ITicketResponse>(
  {
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      required: true,
    },
    technicianName: String,
    technicianEmail: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const attachmentSchema = new Schema<IAttachment>(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const ticketSchema = new Schema<ITicket>(
  {
    ticketId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      required: [true, 'Priority is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    subCategory: {
      type: String,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
    },
    clientPhone: String,
    department: String,
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedTechnicianName: String,
    assignedTechnicianEmail: String,
    responses: [ticketResponseSchema],
    attachments: [attachmentSchema],
    dynamicFields: {
      type: Schema.Types.Mixed,
    },
    lastResponseBy: String,
    lastResponseAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ticketSchema.index({ ticketId: 1 }, { unique: true });
ticketSchema.index({ status: 1 });
ticketSchema.index({ clientEmail: 1 });
ticketSchema.index({ assignedTechnicianEmail: 1 });
ticketSchema.index({ createdAt: -1 });

export default mongoose.model<ITicket>('Ticket', ticketSchema);
