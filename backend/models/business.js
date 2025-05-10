const { sequelize, Sequelize } = require("../config/db");

// Define Business model
const BusinessModel = sequelize.define(
  "business",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(100),
    },
    address: {
      type: Sequelize.TEXT,
    },
    image_url: {
      type: Sequelize.STRING(255),
    },
    is_approved: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    location_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
    tableName: "businesses",
  }
);

// Load other models for associations
const Category = require("./category");
const Location = require("./location");
const User = require("./user");

// Business model methods
const Business = {
  // Get all businesses with filters
  async getAll(filters = {}) {
    try {
      const {
        search,
        category,
        location,
        limit = 10,
        offset = 0,
        approved = true,
      } = filters;

      const whereClause = {};

      if (approved) {
        whereClause.is_approved = true;
      }

      if (category) {
        whereClause.category_id = category;
      }

      if (location) {
        whereClause.location_id = location;
      }

      if (search) {
        whereClause[Sequelize.Op.or] = [
          { name: { [Sequelize.Op.like]: `%${search}%` } },
          { description: { [Sequelize.Op.like]: `%${search}%` } },
        ];
      }

      const businesses = await BusinessModel.findAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["created_at", "DESC"]],
      });

      return businesses;
    } catch (error) {
      throw error;
    }
  },

  // Get business by ID
  async getById(id) {
    try {
      const business = await BusinessModel.findByPk(id);

      // Get related data
      if (business) {
        // Get category
        const category = await sequelize.query(
          `
          SELECT id, name FROM categories WHERE id = ?
        `,
          {
            replacements: [business.category_id],
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        // Get location
        const location = await sequelize.query(
          `
          SELECT id, name FROM locations WHERE id = ?
        `,
          {
            replacements: [business.location_id],
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        business.dataValues.category = category[0] || null;
        business.dataValues.location = location[0] || null;
      }

      return business;
    } catch (error) {
      throw error;
    }
  },

  // Create a new business
  async create(businessData) {
    try {
      return await BusinessModel.create(businessData);
    } catch (error) {
      throw error;
    }
  },

  // Update a business
  async update(id, businessData) {
    try {
      await BusinessModel.update(businessData, {
        where: { id },
      });

      return await BusinessModel.findByPk(id);
    } catch (error) {
      throw error;
    }
  },

  // Delete a business
  async delete(id) {
    try {
      const business = await BusinessModel.findByPk(id);
      if (!business) {
        return null;
      }

      await BusinessModel.destroy({
        where: { id },
      });

      return business;
    } catch (error) {
      throw error;
    }
  },

  // Get businesses by user ID
  async getByUserId(userId) {
    try {
      return await BusinessModel.findAll({
        where: { user_id: userId },
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw error;
    }
  },

  // Approve a business
  async approve(id) {
    try {
      await BusinessModel.update(
        { is_approved: true },
        {
          where: { id },
        }
      );

      return await BusinessModel.findByPk(id);
    } catch (error) {
      throw error;
    }
  },

  // Reject a business
  async reject(id) {
    try {
      await BusinessModel.update(
        { is_approved: false },
        {
          where: { id },
        }
      );

      return await BusinessModel.findByPk(id);
    } catch (error) {
      throw error;
    }
  },

  // Get featured businesses
  async getFeatured(limit = 6) {
    try {
      const [rows] = await sequelize.query(
        `SELECT b.*, c.name as category_name, l.name as location_name 
         FROM businesses b
         JOIN categories c ON b.category_id = c.id
         JOIN locations l ON b.location_id = l.id
         WHERE b.is_approved = true
         ORDER BY RAND()
         LIMIT ?`,
        {
          replacements: [Number(limit)],
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Business;
