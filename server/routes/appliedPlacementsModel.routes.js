import express from "express";
import multer from "multer";

// Import all the controllers

import {
  getAllPlacementIds,
  createPlacements,
  getPlacementsById,
  updatePlacementsOfferLetter,
} from "../controllers/appliedPlacementsModel.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.route("/").get(getAllPlacementIds);
router.route("/:id").post(createPlacements);
router
  .route("/:id")
  .put(upload.single("offerletterurl"), updatePlacementsOfferLetter);
router.route("/:id").get(getPlacementsById);

export default router;
