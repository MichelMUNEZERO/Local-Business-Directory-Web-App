const Category = require("../models/category");

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get all categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// Get categories with business count
exports.getCategoriesWithCount = async (req, res) => {
  try {
    const categories = await Category.getCategoriesWithCount();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories with count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories with count",
    });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.getById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get category by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

// Create a new category (admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide a category name",
      });
    }

    const categoryData = {
      name,
      description: description || null,
      icon: icon || null,
    };

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

// Update a category (admin only)
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description, icon } = req.body;

    // Check if category exists
    const existingCategory = await Category.getById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide a category name",
      });
    }

    const categoryData = {
      name,
      description: description || null,
      icon: icon || null,
    };

    const updatedCategory = await Category.update(categoryId, categoryData);

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

// Delete a category (admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if category exists
    const existingCategory = await Category.getById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    try {
      await Category.delete(categoryId);

      res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      if (error.message.includes("Cannot delete category")) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete category as it is being used by businesses",
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};
