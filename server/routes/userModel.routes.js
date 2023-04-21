import express from "express";

// Import all the controllers
import {
  getAllUsers,
  getUserById,
  createUser,
} from "../controllers/userModel.controller.js";

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/:id").get(getUserById);
router.route("/").get(createUser);

export default router;
