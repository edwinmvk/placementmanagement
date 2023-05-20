import adminModel from "../mongodb/models/adminModel.js";
import mongoose from "mongoose";

const getAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const adminObj = await adminModel.findOne({ username: username });
    if (!adminObj) {
      return res.status(401).json("Invalid username");
    }

    if (password !== adminObj.password) {
      return res.status(401).json("Invalid password");
    }

    return res.status(200).json("Successfully logged in");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  //   try {
  //     const { username, password } = req.body;

  //     const adminExists = await adminModel.findOne({ username });
  //     if (adminExists) {
  //       return res.status(200).json(adminExists);
  //     }
  //     const newAdmin = await adminModel.create({
  //       username,
  //       password,
  //     });
  //     return res.status(200).json(newAdmin);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
};

const getUpdateAdmin = async (req, res) => {
  try {
    const adminObj = await adminModel.findOne({});
    return res.status(200).json(adminObj);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { newpassword } = req.body;

    // Finds the admin by the id
    const userToUpdate = await adminModel.findOne({ username: id });

    // Check if the admin exists
    if (!userToUpdate) {
      return res.status(404).json("Admin not found");
    }

    // start a new session for atomicity property

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Patch the user
      await adminModel
        .findOneAndUpdate(
          { username: id }, // id to update
          { password: newpassword } // fields to be patched
          // { new: true } // Return the updated user object (optional)
        )
        .session(session);
      await session.commitTransaction();
      return res.status(200).json("Password updated");
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

export { getAdmin, getUpdateAdmin, updateAdmin };
