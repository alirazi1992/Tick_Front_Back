import { Router } from 'express';
import { uploadFiles, deleteFile } from '../controllers/uploadController';
import { protect } from '../middleware/auth';
import { uploadMultiple } from '../middleware/upload';

const router = Router();

// All routes require authentication
router.use(protect);

router.post('/', uploadMultiple, uploadFiles);
router.delete('/:filename', deleteFile);

export default router;
