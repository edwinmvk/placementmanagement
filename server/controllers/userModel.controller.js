import userModel from "../mongodb/models/userModel.js";
import appliedPlacementsModel from "../mongodb/models/appliedPlacementsModel.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findOne({ userid: id });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  let photoUrl = null;
  let photoId = null;
  try {
    const { userid, username, email, passoutyear, arrears, cgpa } = req.body;
    if (req.file) {
      const { path } = req.file;
      const uploadedPhoto = await cloudinary.uploader.upload(path);
      photoUrl = uploadedPhoto.secure_url;
      photoId = uploadedPhoto.public_id;
      await fs.unlink(path);
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      if (email.substring(email.indexOf("@") + 1) === "jecc.ac.in") {
        await userModel.create({
          userid: userid,
          username: username,
          email: email,
          passoutyear: passoutyear,
          arrears: arrears,
          cgpa: cgpa,
          avatar: photoUrl,
          avatarpublicid: photoId,
        });

        await session.commitTransaction();
        return res.status(200).json("Successfully registered");
      } else {
        return res.status(401).json("Email domain not recognized");
      }
    } catch (error) {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while creating the user",
      error: error.message,
    });
  }
};

const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { cgpa, arrears, passoutyear } = req.body;

    // Finds the required user by the id
    const userToUpdate = await userModel.findOne({ userid: id });
    // .populate("appliedplacements");  // this replaces the referenced id of the 'appliedplacements key' with the referenced schema, for performing the operations

    // Check if the user exists
    if (!userToUpdate) {
      return res.status(404).json("User not found");
    }

    // start a new session for atomicity property

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Patch the user
      await userModel
        .findOneAndUpdate(
          { userid: id }, // id to update
          { cgpa, arrears, passoutyear } // fields to be patched
          // { new: true } // Return the updated user object (optional)
        )
        .session(session);
      await session.commitTransaction();
      return res.status(200).json("Fields updated");
    } catch (error) {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUserByUser = async (req, res) => {
  let photoUrl = null;
  let photoId = null;
  try {
    const { id } = req.params;
    const { avatarpublicid } = req.body;
    if (req.file) {
      const { path } = req.file;
      const replacedPhoto = await cloudinary.uploader.upload(path, {
        public_id: avatarpublicid,
        overwrite: true, // Overwrite the existing file
      });
      photoUrl = replacedPhoto.secure_url;
      photoId = replacedPhoto.public_id;
      await fs.unlink(path);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Patch the user
      await userModel
        .findOneAndUpdate(
          { userid: id }, // id to update
          { avatar: photoUrl, avatarpublicid: photoId } // fields to be patched
        )
        .session(session);
      await session.commitTransaction();
      return res.status(200).json({ res: photoUrl });
    } catch (error) {
      await session.abortTransaction();
      throw new Error();
    } finally {
      session.endSession();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Finds the required user by the id
    const userToDelete = await userModel
      .findOne({ userid: id })
      .populate("appliedplacements"); // this replaces the referenced id of the 'appliedplacements key' with the referenced schema, for performing the operations

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
      throw new Error();
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
  updateUserByAdmin,
  updateUserByUser,
  deleteUser,
};
