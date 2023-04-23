import { response } from "express";
import userModel from "../mongodb/models/userModel.js";

const checkAllUsers = async (req, res) => {
  try {
    const { userid } = req.body;
    const matchid = await userModel.findOne({ userid });
    if (matchid) {
      return res.status(200).json("registered");
    } else {
      return res.status(200).json("unregistered");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllUsers = async (req, res) => {};
const getUserById = async (req, res) => {};
const createUser = async (req, res) => {};
const updateUser = async (req, res) => {};

export { checkAllUsers, getAllUsers, getUserById, createUser, updateUser };
