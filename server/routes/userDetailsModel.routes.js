import express from "express";

// Import all the controllers

import {
  getAllUserDetails,
  getUserDetailsById,
  createUserDetails,
  updateUserDetails,
} from "../controllers/userDetailsModel.controller.js";

const router = express.Router();

router.route("/").get(getAllUserDetails);
router.route("/:id").get(getUserDetailsById);
router.route("/").post(createUserDetails);
router.route("/:id").get(updateUserDetails);

export default router;
