import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getCategories: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getCategory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createCategory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateCategory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteCategory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const bulkUpdateCategories: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=categoryController.d.ts.map