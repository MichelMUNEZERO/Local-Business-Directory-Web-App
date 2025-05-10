const { sequelize, Sequelize } = require("../config/db");
const bcrypt = require("bcrypt");

// Define User model
const UserModel = sequelize.define(
  "user",
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
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    role: {
      type: Sequelize.ENUM("user", "admin", "business_owner"),
      defaultValue: "user",
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
    tableName: "users",
  }
);

// User model methods
const User = {
  // Create a new user
  async create(userData) {
    const { name, email, password, role = "user" } = userData;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      throw error;
    }
  },

  // Find user by email
  async findByEmail(email) {
    try {
      return await UserModel.findOne({ where: { email } });
    } catch (error) {
      throw error;
    }
  },

  // Find user by ID
  async findById(id) {
    try {
      return await UserModel.findByPk(id, {
        attributes: ["id", "name", "email", "role"],
      });
    } catch (error) {
      throw error;
    }
  },

  // Update user
  async update(id, userData) {
    const { name, email, role } = userData;

    try {
      await UserModel.update({ name, email, role }, { where: { id } });

      return { id, name, email, role };
    } catch (error) {
      throw error;
    }
  },

  // Change password
  async changePassword(id, newPassword) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await UserModel.update({ password: hashedPassword }, { where: { id } });

      return true;
    } catch (error) {
      throw error;
    }
  },

  // Compare password
  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  },
};

module.exports = User;
