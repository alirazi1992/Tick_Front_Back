"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpdateCategories = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = exports.getCategories = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const appError_1 = require("../utils/appError");
const logger_1 = __importDefault(require("../utils/logger"));
// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Private
const getCategories = async (_req, res, next) => {
    try {
        const categories = await Category_1.default.find({ isActive: true });
        // Transform to frontend format
        const categoriesData = {};
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
    }
    catch (error) {
        next(error);
    }
};
exports.getCategories = getCategories;
// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Private
const getCategory = async (req, res, next) => {
    try {
        const category = await Category_1.default.findOne({ categoryId: req.params.id });
        if (!category) {
            return next(new appError_1.AppError('Category not found', 404));
        }
        res.status(200).json({
            success: true,
            data: { category },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCategory = getCategory;
// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private (Admin only)
const createCategory = async (req, res, next) => {
    try {
        const { categoryId, label, description, subIssues } = req.body;
        // Check if category already exists
        const existingCategory = await Category_1.default.findOne({ categoryId });
        if (existingCategory) {
            return next(new appError_1.AppError('Category with this ID already exists', 400));
        }
        const category = await Category_1.default.create({
            categoryId,
            label,
            description,
            subIssues: new Map(Object.entries(subIssues || {})),
        });
        logger_1.default.info(`New category created: ${categoryId} by ${req.user?.email}`);
        res.status(201).json({
            success: true,
            data: { category },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createCategory = createCategory;
// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private (Admin only)
const updateCategory = async (req, res, next) => {
    try {
        const { label, description, subIssues } = req.body;
        let category = await Category_1.default.findOne({ categoryId: req.params.id });
        if (!category) {
            return next(new appError_1.AppError('Category not found', 404));
        }
        const updateData = {};
        if (label)
            updateData.label = label;
        if (description !== undefined)
            updateData.description = description;
        if (subIssues)
            updateData.subIssues = new Map(Object.entries(subIssues));
        category = await Category_1.default.findOneAndUpdate({ categoryId: req.params.id }, updateData, {
            new: true,
            runValidators: true,
        });
        logger_1.default.info(`Category updated: ${req.params.id} by ${req.user?.email}`);
        res.status(200).json({
            success: true,
            data: { category },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCategory = updateCategory;
// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private (Admin only)
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category_1.default.findOne({ categoryId: req.params.id });
        if (!category) {
            return next(new appError_1.AppError('Category not found', 404));
        }
        // Soft delete by setting isActive to false
        category.isActive = false;
        await category.save();
        logger_1.default.info(`Category deleted: ${req.params.id} by ${req.user?.email}`);
        res.status(200).json({
            success: true,
            data: {},
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCategory = deleteCategory;
// @desc    Bulk update categories
// @route   PUT /api/v1/categories/bulk
// @access  Private (Admin only)
const bulkUpdateCategories = async (req, res, next) => {
    try {
        const { categories } = req.body;
        if (!categories || typeof categories !== 'object') {
            return next(new appError_1.AppError('Invalid categories data', 400));
        }
        const results = [];
        for (const [categoryId, categoryData] of Object.entries(categories)) {
            const existingCategory = await Category_1.default.findOne({ categoryId });
            if (existingCategory) {
                // Update existing category
                await Category_1.default.findOneAndUpdate({ categoryId }, {
                    label: categoryData.label,
                    description: categoryData.description,
                    subIssues: new Map(Object.entries(categoryData.subIssues || {})),
                }, { new: true, runValidators: true });
                results.push({ categoryId, action: 'updated' });
            }
            else {
                // Create new category
                await Category_1.default.create({
                    categoryId,
                    label: categoryData.label,
                    description: categoryData.description,
                    subIssues: new Map(Object.entries(categoryData.subIssues || {})),
                });
                results.push({ categoryId, action: 'created' });
            }
        }
        logger_1.default.info(`Bulk category update by ${req.user?.email}`);
        res.status(200).json({
            success: true,
            data: { results },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.bulkUpdateCategories = bulkUpdateCategories;
//# sourceMappingURL=categoryController.js.map