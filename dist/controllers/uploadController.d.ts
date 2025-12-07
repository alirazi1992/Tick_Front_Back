import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const uploadFiles: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteFile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=uploadController.d.ts.map