import mongoose, { Document } from 'mongoose';
export type UserRole = 'client' | 'engineer' | 'admin';
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone?: string;
    department?: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map