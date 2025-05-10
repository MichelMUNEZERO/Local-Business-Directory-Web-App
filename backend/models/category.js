const { sequelize, Sequelize } = require("../config/db");

// Define Category model
const CategoryModel = sequelize.define(
  "category",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: Sequelize.TEXT,
    },
    icon: {
      type: Sequelize.STRING(255),
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: false,
    tableName: "categories",
  }
);

// Category model methods
const Category = {
  // Get all categories
  async getAll() {
    try {
      return await CategoryModel.findAll();
    } catch (error) {
      throw error;
    }
  },

  // Get category by ID
  async getById(id) {
    try {
      return await CategoryModel.findByPk(id);
    } catch (error) {
      throw error;
    }
  },

  // Create a new category
  async create(categoryData) {
    try {
      return await CategoryModel.create(categoryData);
    } catch (error) {
      throw error;
    }
  },

  // Update a category
  async update(id, categoryData) {
    try {
      await CategoryModel.update(categoryData, {
        where: { id },
      });

      return await CategoryModel.findByPk(id);
    } catch (error) {
      throw error;
    }
  },

  // Delete a category
  async delete(id) {
    try {
      const category = await CategoryModel.findByPk(id);
      if (!category) {
        return null;
      }

      await CategoryModel.destroy({
        where: { id },
      });

      return category;
    } catch (error) {
      throw error;
    }
  },

  // Get categories with business count
  async getCategoriesWithCount() {
    try {
      const [rows] = await sequelize.query(`
        SELECT c.*, COUNT(b.id) as business_count
        FROM categories c
        LEFT JOIN businesses b ON c.id = b.category_id AND b.is_approved = true
        GROUP BY c.id
        ORDER BY c.name ASC
      `);

      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Category;
