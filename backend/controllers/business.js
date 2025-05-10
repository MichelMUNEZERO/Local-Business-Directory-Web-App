const Business = require("../models/business");
const path = require("path");
const fs = require("fs");

// Get all businesses with pagination and filtering
exports.getAllBusinesses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      location,
      search,
      approved_only = true,
    } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      category_id: category ? parseInt(category, 10) : undefined,
      location_id: location ? parseInt(location, 10) : undefined,
      search,
      approved_only: approved_only === "false" ? false : true,
    };

    const result = await Business.getAll(options);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Get all businesses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch businesses",
    });
  }
};

// Get a single business by ID
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.getById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    res.status(200).json({
      success: true,
      data: business,
    });
  } catch (error) {
    console.error("Get business by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch business",
    });
  }
};

// Create a new business
exports.createBusiness = async (req, res) => {
  try {
    const {
      name,
      description,
      phone,
      email,
      address,
      category_id,
      location_id,
    } = req.body;

    // Basic validation
    if (!name || !description || !phone || !category_id || !location_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Handle image upload if available
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const businessData = {
      name,
      description,
      phone,
      email: email || null,
      address,
      category_id,
      location_id,
      user_id: req.user.id,
      image_url,
      is_approved: req.user.role === "admin", // Auto-approve if admin
    };

    const business = await Business.create(businessData);

    res.status(201).json({
      success: true,
      message:
        req.user.role === "admin"
          ? "Business created successfully"
          : "Business submitted for approval",
      data: business,
    });
  } catch (error) {
    console.error("Create business error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create business",
    });
  }
};

// Update a business
exports.updateBusiness = async (req, res) => {
  try {
    const businessId = req.params.id;

    // Check if business exists
    const existingBusiness = await Business.getById(businessId);
    if (!existingBusiness) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    // Check ownership unless admin
    if (req.user.role !== "admin" && existingBusiness.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this business",
      });
    }

    // Handle image upload if available
    let image_url = existingBusiness.image_url;
    if (req.file) {
      // Delete old image if exists
      if (existingBusiness.image_url) {
        const oldImagePath = path.join(
          __dirname,
          "../public",
          existingBusiness.image_url
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      image_url = `/uploads/${req.file.filename}`;
    }

    const businessData = {
      name: req.body.name,
      description: req.body.description,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      category_id: req.body.category_id,
      location_id: req.body.location_id,
      image_url,
    };

    const updatedBusiness = await Business.update(businessId, businessData);

    res.status(200).json({
      success: true,
      message: "Business updated successfully",
      data: updatedBusiness,
    });
  } catch (error) {
    console.error("Update business error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update business",
    });
  }
};

// Delete a business
exports.deleteBusiness = async (req, res) => {
  try {
    const businessId = req.params.id;

    // Check if business exists
    const existingBusiness = await Business.getById(businessId);
    if (!existingBusiness) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    // Check ownership unless admin
    if (req.user.role !== "admin" && existingBusiness.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this business",
      });
    }

    // Delete business image if exists
    if (existingBusiness.image_url) {
      const imagePath = path.join(
        __dirname,
        "../public",
        existingBusiness.image_url
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Business.delete(businessId);

    res.status(200).json({
      success: true,
      message: "Business deleted successfully",
    });
  } catch (error) {
    console.error("Delete business error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete business",
    });
  }
};

// Get businesses for current user
exports.getMyBusinesses = async (req, res) => {
  try {
    const businesses = await Business.getByUserId(req.user.id);

    res.status(200).json({
      success: true,
      data: businesses,
    });
  } catch (error) {
    console.error("Get my businesses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your businesses",
    });
  }
};

// Admin: Approve or reject business
exports.setApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    // Check if business exists
    const existingBusiness = await Business.getById(id);
    if (!existingBusiness) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    const updatedBusiness = await Business.setApprovalStatus(id, is_approved);

    res.status(200).json({
      success: true,
      message: is_approved
        ? "Business approved successfully"
        : "Business rejected",
      data: updatedBusiness,
    });
  } catch (error) {
    console.error("Set approval status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update approval status",
    });
  }
};

// Get featured businesses for homepage
exports.getFeaturedBusinesses = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const businesses = await Business.getFeatured(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      data: businesses,
    });
  } catch (error) {
    console.error("Get featured businesses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured businesses",
    });
  }
};
