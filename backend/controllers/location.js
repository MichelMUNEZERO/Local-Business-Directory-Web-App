const Location = require("../models/location");

// Get all locations
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.getAll();

    res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error("Get all locations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch locations",
    });
  }
};

// Get locations with business count
exports.getLocationsWithCount = async (req, res) => {
  try {
    const locations = await Location.getLocationsWithCount();

    res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error("Get locations with count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch locations with count",
    });
  }
};

// Get a single location by ID
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.getById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error("Get location by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch location",
    });
  }
};

// Create a new location (admin only)
exports.createLocation = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide a location name",
      });
    }

    const locationData = {
      name,
      description: description || null,
    };

    const location = await Location.create(locationData);

    res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: location,
    });
  } catch (error) {
    console.error("Create location error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create location",
    });
  }
};

// Update a location (admin only)
exports.updateLocation = async (req, res) => {
  try {
    const locationId = req.params.id;
    const { name, description } = req.body;

    // Check if location exists
    const existingLocation = await Location.getById(locationId);
    if (!existingLocation) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    // Basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide a location name",
      });
    }

    const locationData = {
      name,
      description: description || null,
    };

    const updatedLocation = await Location.update(locationId, locationData);

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      data: updatedLocation,
    });
  } catch (error) {
    console.error("Update location error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update location",
    });
  }
};

// Delete a location (admin only)
exports.deleteLocation = async (req, res) => {
  try {
    const locationId = req.params.id;

    // Check if location exists
    const existingLocation = await Location.getById(locationId);
    if (!existingLocation) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    try {
      await Location.delete(locationId);

      res.status(200).json({
        success: true,
        message: "Location deleted successfully",
      });
    } catch (error) {
      if (error.message.includes("Cannot delete location")) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete location as it is being used by businesses",
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Delete location error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete location",
    });
  }
};
