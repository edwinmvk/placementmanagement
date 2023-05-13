import express from "express";

// Import all the controllers

import {
  getPlacements,
  createPlacements,
  deletePlacements,
} from "../controllers/placementsModel.controller.js";

const router = express.Router();

router.route("/").get(getPlacements);
router.route("/").post(createPlacements);
router.route("/").delete(deletePlacements);

export default router;
