const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { testConnection } = require("./config/db");

// Load environment variables
dotenv.config();

// Import route files
const businessRoutes = require("./routes/businesses");
const categoryRoutes = require("./routes/categories");
const locationRoutes = require("./routes/locations");
const authRoutes = require("./routes/auth");

// Initialize express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "public/uploads");
if (!require("fs").existsSync(uploadsDir)) {
  require("fs").mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use("/api/businesses", businessRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Local Business Directory API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
// Test database connection before starting server
testConnection()
  .then((connected) => {
    if (connected) {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } else {
      console.error("Failed to connect to database. Check your configuration.");
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("Error during database connection test:", err);
    process.exit(1);
  });
