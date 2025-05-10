import axios from "axios";

// Business API service
export const BusinessService = {
  // Get all businesses with pagination and filters
  getAllBusinesses: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = { page, limit, ...filters };
      const response = await axios.get("/api/businesses", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching businesses:", error);
      throw error;
    }
  },

  // Get a single business by ID
  getBusinessById: async (id) => {
    try {
      const response = await axios.get(`/api/businesses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching business with ID ${id}:`, error);
      throw error;
    }
  },

  // Get featured businesses
  getFeaturedBusinesses: async (limit = 6) => {
    try {
      const response = await axios.get("/api/businesses/featured", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching featured businesses:", error);
      throw error;
    }
  },

  // Create a new business
  createBusiness: async (businessData) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Append text fields
      Object.keys(businessData).forEach((key) => {
        if (key !== "image") {
          formData.append(key, businessData[key]);
        }
      });

      // Append file if exists
      if (businessData.image) {
        formData.append("image", businessData.image);
      }

      const response = await axios.post("/api/businesses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating business:", error);
      throw error;
    }
  },

  // Update business
  updateBusiness: async (id, businessData) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Append text fields
      Object.keys(businessData).forEach((key) => {
        if (key !== "image") {
          formData.append(key, businessData[key]);
        }
      });

      // Append file if exists
      if (businessData.image) {
        formData.append("image", businessData.image);
      }

      const response = await axios.put(`/api/businesses/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error updating business with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete business
  deleteBusiness: async (id) => {
    try {
      const response = await axios.delete(`/api/businesses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting business with ID ${id}:`, error);
      throw error;
    }
  },

  // Get businesses owned by current user
  getMyBusinesses: async () => {
    try {
      const response = await axios.get("/api/businesses/user/my-businesses");
      return response.data;
    } catch (error) {
      console.error("Error fetching user businesses:", error);
      throw error;
    }
  },

  // Set approval status (admin only)
  setApprovalStatus: async (id, isApproved) => {
    try {
      const response = await axios.patch(`/api/businesses/${id}/approve`, {
        is_approved: isApproved,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error setting approval status for business with ID ${id}:`,
        error
      );
      throw error;
    }
  },
};

// Category API service
export const CategoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await axios.get("/api/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get categories with business count
  getCategoriesWithCount: async () => {
    try {
      const response = await axios.get("/api/categories/with-count");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories with count:", error);
      throw error;
    }
  },

  // Create category (admin only)
  createCategory: async (categoryData) => {
    try {
      const response = await axios.post("/api/categories", categoryData);
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Update category (admin only)
  updateCategory: async (id, categoryData) => {
    try {
      const response = await axios.put(`/api/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete category (admin only)
  deleteCategory: async (id) => {
    try {
      const response = await axios.delete(`/api/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      throw error;
    }
  },
};

// Location API service
export const LocationService = {
  // Get all locations
  getAllLocations: async () => {
    try {
      const response = await axios.get("/api/locations");
      return response.data;
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }
  },

  // Get locations with business count
  getLocationsWithCount: async () => {
    try {
      const response = await axios.get("/api/locations/with-count");
      return response.data;
    } catch (error) {
      console.error("Error fetching locations with count:", error);
      throw error;
    }
  },

  // Create location (admin only)
  createLocation: async (locationData) => {
    try {
      const response = await axios.post("/api/locations", locationData);
      return response.data;
    } catch (error) {
      console.error("Error creating location:", error);
      throw error;
    }
  },

  // Update location (admin only)
  updateLocation: async (id, locationData) => {
    try {
      const response = await axios.put(`/api/locations/${id}`, locationData);
      return response.data;
    } catch (error) {
      console.error(`Error updating location with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete location (admin only)
  deleteLocation: async (id) => {
    try {
      const response = await axios.delete(`/api/locations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting location with ID ${id}:`, error);
      throw error;
    }
  },
};
