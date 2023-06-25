import express from "express";

// Import all the controllers

import {
  createUserNotification,
  getUserNotification,
  deleteUserNotification,
} from "../controllers/userNotificationModel.controller.js";

const router = express.Router();

router.route("/:id").post(createUserNotification);
router.route("/:id").get(getUserNotification);
router.route("/:id").delete(deleteUserNotification);

export default router;
