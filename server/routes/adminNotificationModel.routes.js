import express from "express";

// Import all the controllers

import {
  createAdminNotification,
  getAdminNotification,
  deleteAdminNotification,
} from "../controllers/adminNotificationModel.controller.js";

const router = express.Router();

router.route("/:id").post(createAdminNotification);
router.route("/").get(getAdminNotification);
router.route("/").delete(deleteAdminNotification);

export default router;
