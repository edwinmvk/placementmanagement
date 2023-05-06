import express from "express";

// Import all the controllers

import {
  createPlacements,
  deletePlacements,
} from "../controllers/placementsModel.controller.js";

const router = express.Router();

router.route("/").post(createPlacements);
router.route("/").delete(deletePlacements);

export default router;
