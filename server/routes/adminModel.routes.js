import express from "express";
import {
  validateAdminJwt,
  checkReloadAdminJwt,
  deleteAdminCookie,
} from "../jwt/jwt.js";

// Import all the controllers

import { getAdmin, updateAdmin } from "../controllers/adminModel.controller.js";

const router = express.Router();

router.route("/").post(getAdmin);
router.route("/:id").patch(validateAdminJwt, updateAdmin);

// this route is only to check the logged in state of admin during page reload
router.route("/checkreloadadminjwt").get(validateAdminJwt, checkReloadAdminJwt);
// this route is only to delete cookie during logout
router.route("/deletecookie").get(deleteAdminCookie);

export default router;
