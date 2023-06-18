import express from "express";

// Import all the controllers

import {
  getAllPlacementIds,
  createPlacements,
  updatePlacements,
} from "../controllers/appliedPlacementsModel.controller.js";

const router = express.Router();

router.route("/").get(getAllPlacementIds);
router.route("/:id").post(createPlacements);
router.route("/:id").patch(updatePlacements);

export default router;
