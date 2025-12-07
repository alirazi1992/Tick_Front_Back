import mongoose, { Document } from 'mongoose';
export type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'tel' | 'date' | 'datetime' | 'select' | 'radio' | 'checkbox' | 'file';
export interface IDynamicField {
    id: string;
    label: string;
    type: FieldType;
    required?: boolean;
    placeholder?: string;
    options?: Array<{
        value: string;
        label: string;
    }>;
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
declare const _default: mongoose.Model<ICategory, {}, {}, {}, mongoose.Document<unknown, {}, ICategory, {}, {}> & ICategory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Category.d.ts.map