import userModel from "../mongodb/models/userModel.js";
import appliedPlacementsModel from "../mongodb/models/appliedPlacementsModel.js";
import mongoose from "mongoose";

const checkAllUsers = async (req, res) => {
  try {
    const { userid } = req.body;
    const matchid = await userModel.findOne({ userid: userid });
    if (matchid) {
      return res.status(200).json("registered");
    } else {
      return res.status(200).json("unregistered");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { userid, username, email, passoutyear, arrears, cgpa, avatar } =
      req.body;
    if (email.substring(email.indexOf("@") + 1) === "jecc.ac.in") {
      await userModel.create({
        userid,
        username,
        email,
        passoutyear,
        arrears,
        cgpa,
        avatar,
      });
      return res.status(200).json("Successfully registered");
    } else {
      return res.status(401).json("Email domain not recogonized");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {};

const getUserById = async (req, res) => {};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user and populate the 'appliedplacements' field
    const userToDelete = await userModel
      .findOne({ userid: id })
      .populate("appliedplacements");

    // Check if the user exists
    if (!userToDelete) {
      return res.status(404).json("User not found");
    }

    // start a new session for atomicity property

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Delete all related appliedplacements
      const appliedPlacementsIds = userToDelete.appliedplacements.map(
        (ap) => ap._id
      );
      await appliedPlacementsModel
        .deleteMany({
          _id: { $in: appliedPlacementsIds },
        })
        .session(session);

      // Delete the user
      await userModel.findOneAndDelete({ userid: id }).session(session);

      await session.commitTransaction();
      return res.status(200).json("Deleted");
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  checkAllUsers,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
