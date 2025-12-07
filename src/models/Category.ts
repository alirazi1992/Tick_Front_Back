import mongoose, { Document, Schema } from 'mongoose';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'tel'
  | 'date'
  | 'datetime'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file';

export interface IDynamicField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface ISubIssue {
  id: string;
  label: string;
  description?: string;
  fields?: IDynamicField[];
}

export interface ICategory extends Document {
  categoryId: string;
  label: string;
  description?: string;
  subIssues: Map<string, ISubIssue>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const dynamicFieldSchema = new Schema<IDynamicField>(
  {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'text',
        'textarea',
        'number',
        'email',
        'tel',
        'date',
        'datetime',
        'select',
        'radio',
        'checkbox',
        'file',
      ],
      required: true,
    },
    required: Boolean,
    placeholder: String,
    options: [
      {
        value: String,
        label: String,
      },
    ],
  },
  { _id: false }
);

const subIssueSchema = new Schema<ISubIssue>(
  {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    description: String,
    fields: [dynamicFieldSchema],
  },
  { _id: false }
);

const categorySchema = new Schema<ICategory>(
  {
    categoryId: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    description: String,
    subIssues: {
      type: Map,
      of: subIssueSchema,
      default: new Map(),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ categoryId: 1 }, { unique: true });

export default mongoose.model<ICategory>('Category', categorySchema);
