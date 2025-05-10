const express = require("express");
const router = express.Router();
const locationController = require("../controllers/location");
const { verifyToken, isAdmin } = require("../middlewares/auth");

// Public routes
router.get("/", locationController.getAllLocations);
router.get("/with-count", locationController.getLocationsWithCount);
router.get("/:id", locationController.getLocationById);

// Admin routes (protected)
router.post("/", verifyToken, isAdmin, locationController.createLocation);
router.put("/:id", verifyToken, isAdmin, locationController.updateLocation);
router.delete("/:id", verifyToken, isAdmin, locationController.deleteLocation);

module.exports = router;
