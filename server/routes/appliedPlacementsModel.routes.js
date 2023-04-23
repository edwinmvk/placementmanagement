import express from "express";

// Import all the controllers

import {
  getAllPlacements,
  getPlacementsById,
  createPlacements,
  updatePlacements,
} from "../controllers/appliedPlacementsModel.controller.js";

const router = express.Router();

router.route("/").get(getAllPlacements);
router.route("/:id").get(getPlacementsById);
router.route("/").post(createPlacements);
router.route("/:id").patch(updatePlacements);

export default router;
