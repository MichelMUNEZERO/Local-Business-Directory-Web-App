const { sequelize, Sequelize } = require("../config/db");

// Define Location model
const LocationModel = sequelize.define(
  "location",
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
    tableName: "locations",
  }
);

// Location model methods
const Location = {
  // Get all locations
  async getAll() {
    try {
      return await LocationModel.findAll();
    } catch (error) {
      throw error;
    }
  },

  // Get location by ID
  async getById(id) {
    try {
      return await LocationModel.findByPk(id);
    } catch (error) {
      throw error;
    }
  },

  // Create a new location
  async create(locationData) {
    try {
      return await LocationModel.create(locationData);
    } catch (error) {
      throw error;
    }
  },

  // Update a location
  async update(id, locationData) {
    try {
      await LocationModel.update(locationData, {
        where: { id },
      });

      return await LocationModel.findByPk(id);
    } catch (error) {
      throw error;
    }
  },

  // Delete a location
  async delete(id) {
    try {
      const location = await LocationModel.findByPk(id);
      if (!location) {
        return null;
      }

      await LocationModel.destroy({
        where: { id },
      });

      return location;
    } catch (error) {
      throw error;
    }
  },

  // Get locations with business count
  async getLocationsWithCount() {
    try {
      const [rows] = await sequelize.query(`
        SELECT l.*, COUNT(b.id) as business_count
        FROM locations l
        LEFT JOIN businesses b ON l.id = b.location_id
        GROUP BY l.id
        ORDER BY l.name ASC
      `);

      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Location;
