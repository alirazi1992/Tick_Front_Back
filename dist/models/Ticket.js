"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ticketResponseSchema = new mongoose_1.Schema({
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
}, { _id: false });
const attachmentSchema = new mongoose_1.Schema({
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
}, { _id: false });
const ticketSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    assignedTechnicianName: String,
    assignedTechnicianEmail: String,
    responses: [ticketResponseSchema],
    attachments: [attachmentSchema],
    dynamicFields: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    lastResponseBy: String,
    lastResponseAt: Date,
}, {
    timestamps: true,
});
// Indexes for better query performance
ticketSchema.index({ ticketId: 1 }, { unique: true });
ticketSchema.index({ status: 1 });
ticketSchema.index({ clientEmail: 1 });
ticketSchema.index({ assignedTechnicianEmail: 1 });
ticketSchema.index({ createdAt: -1 });
exports.default = mongoose_1.default.model('Ticket', ticketSchema);
//# sourceMappingURL=Ticket.js.map