const bcrypt = require("bcrypt");
const { sequelize, Sequelize } = require("../config/db");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

// Define models
const User = sequelize.define(
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

const Category = sequelize.define(
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

const Location = sequelize.define(
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

const Business = sequelize.define(
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

// Define relationships
Business.belongsTo(Category, { foreignKey: "category_id" });
Business.belongsTo(Location, { foreignKey: "location_id" });
Business.belongsTo(User, { foreignKey: "user_id" });

// Sample data
const categories = [
  { name: "Salon & Beauty" },
  { name: "Restaurants & Food" },
  { name: "Retail & Shopping" },
  { name: "Health & Medical" },
  { name: "Repair Services" },
  { name: "Education" },
  { name: "Transportation" },
  { name: "Technology" },
  { name: "Financial Services" },
  { name: "Entertainment" },
];

const locations = [
  { name: "Nyarugenge" },
  { name: "Kicukiro" },
  { name: "Gasabo" },
  { name: "Huye" },
  { name: "Musanze" },
  { name: "Rubavu" },
  { name: "Muhanga" },
  { name: "Rusizi" },
  { name: "Nyagatare" },
  { name: "Rwamagana" },
];

// Initialize database
async function initDatabase() {
  try {
    // Sync database models
    await sequelize.sync({ force: true });
    console.log("Database tables created");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });
    console.log("Default admin user created");

    // Insert sample categories
    await Category.bulkCreate(categories);
    console.log("Sample categories inserted");

    // Insert sample locations
    await Location.bulkCreate(locations);
    console.log("Sample locations inserted");

    console.log("Database initialization completed successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    // Don't close the connection - let Sequelize handle that
  }
}

// Run the initialization
initDatabase();
