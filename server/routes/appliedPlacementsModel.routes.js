import express from "express";

// Import all the controllers

import {
  getAllPlacements,
  getPlacementsById,
  createPlacements,
  updatePlacements,
  deletePlacements,
} from "../controllers/appliedPlacementsModel.controller.js";

const router = express.Router();

router.route("/").get(getAllPlacements);
router.route("/:id").get(getPlacementsById);
router.route("/:id").post(createPlacements);
router.route("/:id").patch(updatePlacements);
router.route("/:id").delete(deletePlacements);

export default router;
