const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category");
const { verifyToken, isAdmin } = require("../middlewares/auth");

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/with-count", categoryController.getCategoriesWithCount);
router.get("/:id", categoryController.getCategoryById);

// Admin routes (protected)
router.post("/", verifyToken, isAdmin, categoryController.createCategory);
router.put("/:id", verifyToken, isAdmin, categoryController.updateCategory);
router.delete("/:id", verifyToken, isAdmin, categoryController.deleteCategory);

module.exports = router;
