import { Response, NextFunction } from 'express';
import Category from '../models/Category';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/appError';
import logger from '../utils/logger';

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Private
export const getCategories = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find({ isActive: true });

    // Transform to frontend format
    const categoriesData: Record<string, any> = {};
    categories.forEach((cat) => {
      categoriesData[cat.categoryId] = {
        id: cat.categoryId,
        label: cat.label,
        description: cat.description,
        subIssues: Object.fromEntries(cat.subIssues),
      };
    });

    res.status(200).json({
      success: true,
      data: { categories: categoriesData },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Private
export const getCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findOne({ categoryId: req.params.id });

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
      success: true,
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private (Admin only)
export const createCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { categoryId, label, description, subIssues } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ categoryId });
    if (existingCategory) {
      return next(new AppError('Category with this ID already exists', 400));
    }

    const category = await Category.create({
      categoryId,
      label,
      description,
      subIssues: new Map(Object.entries(subIssues || {})),
    });

    logger.info(`New category created: ${categoryId} by ${req.user?.email}`);

    res.status(201).json({
      success: true,
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private (Admin only)
export const updateCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { label, description, subIssues } = req.body;

    let category = await Category.findOne({ categoryId: req.params.id });

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    const updateData: any = {};
    if (label) updateData.label = label;
    if (description !== undefined) updateData.description = description;
    if (subIssues) updateData.subIssues = new Map(Object.entries(subIssues));

    category = await Category.findOneAndUpdate({ categoryId: req.params.id }, updateData, {
      new: true,
      runValidators: true,
    });

    logger.info(`Category updated: ${req.params.id} by ${req.user?.email}`);

    res.status(200).json({
      success: true,
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private (Admin only)
export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findOne({ categoryId: req.params.id });

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    // Soft delete by setting isActive to false
    category.isActive = false;
    await category.save();

    logger.info(`Category deleted: ${req.params.id} by ${req.user?.email}`);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update categories
// @route   PUT /api/v1/categories/bulk
// @access  Private (Admin only)
export const bulkUpdateCategories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categories } = req.body;

    if (!categories || typeof categories !== 'object') {
      return next(new AppError('Invalid categories data', 400));
    }

    const results = [];

    for (const [categoryId, categoryData] of Object.entries(categories as Record<string, any>)) {
      const existingCategory = await Category.findOne({ categoryId });

      if (existingCategory) {
        // Update existing category
        await Category.findOneAndUpdate(
          { categoryId },
          {
            label: categoryData.label,
            description: categoryData.description,
            subIssues: new Map(Object.entries(categoryData.subIssues || {})),
          },
          { new: true, runValidators: true }
        );
        results.push({ categoryId, action: 'updated' });
      } else {
        // Create new category
        await Category.create({
          categoryId,
          label: categoryData.label,
          description: categoryData.description,
          subIssues: new Map(Object.entries(categoryData.subIssues || {})),
        });
        results.push({ categoryId, action: 'created' });
      }
    }

    logger.info(`Bulk category update by ${req.user?.email}`);

    res.status(200).json({
      success: true,
      data: { results },
    });
  } catch (error) {
    next(error);
  }
};
