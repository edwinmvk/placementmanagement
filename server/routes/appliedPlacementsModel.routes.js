import express from "express";
import multer from "multer";

// Import all the controllers

import {
  getAllPlacementIds,
  createPlacements,
  getPlacedNumber,
  getPlacementsById,
  updatePlacementsOfferLetter,
  updatePlacementsStatus,
} from "../controllers/appliedPlacementsModel.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.route("/").get(getAllPlacementIds);
router.route("/:id").post(createPlacements);
router
  .route("/:id")
  .put(upload.single("offerletterurl"), updatePlacementsOfferLetter);
router.route("/placednumber").get(getPlacedNumber);
router.route("/:id").get(getPlacementsById);
router.route("/:id").patch(updatePlacementsStatus);

export default router;
