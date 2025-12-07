import { Router } from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkUpdateCategories,
} from '../controllers/categoryController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(protect);

// Bulk update (admin only)
router.put('/bulk', restrictTo('admin'), bulkUpdateCategories);

// Category CRUD operations
router.route('/').get(getCategories).post(restrictTo('admin'), createCategory);

router
  .route('/:id')
  .get(getCategory)
  .put(restrictTo('admin'), updateCategory)
  .delete(restrictTo('admin'), deleteCategory);

export default router;
