const express = require("express");
const router = express.Router();
const businessController = require("../controllers/business");
const {
  verifyToken,
  isAdmin,
  isBusinessOwnerOrAdmin,
} = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "business-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (ext && mimetype) {
      return cb(null, true);
    }

    cb(new Error("Only image files are allowed!"));
  },
});

// Public routes
router.get("/", businessController.getAllBusinesses);
router.get("/featured", businessController.getFeaturedBusinesses);
router.get("/:id", businessController.getBusinessById);

// Protected routes
router.get(
  "/user/my-businesses",
  verifyToken,
  businessController.getMyBusinesses
);
router.post(
  "/",
  verifyToken,
  upload.single("image"),
  businessController.createBusiness
);
router.put(
  "/:id",
  verifyToken,
  upload.single("image"),
  isBusinessOwnerOrAdmin,
  businessController.updateBusiness
);
router.delete(
  "/:id",
  verifyToken,
  isBusinessOwnerOrAdmin,
  businessController.deleteBusiness
);

// Admin routes
router.patch(
  "/:id/approve",
  verifyToken,
  isAdmin,
  businessController.setApprovalStatus
);

module.exports = router;
