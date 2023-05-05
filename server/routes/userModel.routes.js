import express from "express";

// Import all the controllers

import {
  checkAllUsers,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userModel.controller.js";

const router = express.Router();

router.route("/").post(checkAllUsers);
router.route("/").get(getAllUsers);
router.route("/:id").get(getUserById);
router.route("/register").post(createUser);
router.route("/:id").patch(updateUser);
router.route("/:id").delete(deleteUser);

export default router;
