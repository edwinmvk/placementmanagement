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
      throw error;
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
    const { cgpa, arrears } = req.body;

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
          { cgpa, arrears } // fields to be patched
          // { new: true } // Return the updated user object (optional)
        )
        .session(session);
      await session.commitTransaction();
      return res.status(200).json("Fields updated");
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
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const uploadResume = async (req, res) => {
  let resumeUrl = null;
  let resumeId = null;
  try {
    const { id } = req.params;
    if (req.body.resumepublicid) {
      const { resumepublicid } = req.body;
      // this is for replacng the already uploaded resume
      if (req.file) {
        const { path } = req.file;
        const replacedResume = await cloudinary.uploader.upload(path, {
          public_id: resumepublicid,
          overwrite: true, // Overwrite the existing file
        });
        resumeUrl = replacedResume.secure_url;
        resumeId = replacedResume.public_id;
        await fs.unlink(path);
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Patch the user
        await userModel
          .findOneAndUpdate(
            { userid: id }, // id to update
            { resumeurl: resumeUrl, resumepublicid: resumeId } // fields to be patched
          )
          .session(session);
        await session.commitTransaction();
        return res.status(200).json({ res: resumeUrl });
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    }
    // this is for new resume upload
    else {
      if (req.file) {
        const { path } = req.file;
        const uploadedResume = await cloudinary.uploader.upload(path);
        resumeUrl = uploadedResume.secure_url;
        resumeId = uploadedResume.public_id;
        await fs.unlink(path);
      }
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Patch the user
        await userModel
          .findOneAndUpdate(
            { userid: id }, // id to update
            { resumeurl: resumeUrl, resumepublicid: resumeId } // fields to be patched
          )
          .session(session);
        await session.commitTransaction();
        return res.status(200).json({ res: resumeUrl });
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAppliedPlacementsById = async (req, res) => {
  try {
    const { id } = req.params;
    const userObj = await userModel
      .findOne({ userid: id })
      .populate("appliedplacements");
    return res.status(200).json(userObj.appliedplacements);
  } catch (error) {
    return res.status(500).json("baad");
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
      // Delete the avatar, resume, offerletter from cloudinary if they are present
      if (userToDelete.avatarpublicid) {
        await cloudinary.uploader.destroy(
          userToDelete.avatarpublicid,
          (error, result) => {
            if (error) {
              console.log("Error deleting file:", error);
            }
          }
        );
      }

      if (userToDelete.resumepublicid) {
        await cloudinary.uploader.destroy(
          userToDelete.resumepublicid,
          (error, result) => {
            if (error) {
              console.log("Error deleting file:", error);
            }
          }
        );
      }

      // Extract the offerletterpublic id from the user's applied placement array
      // Filter out undefined values because they can have undefined values instead of null which cause errors

      const offerLetterPublicId = userToDelete.appliedplacements
        .map((placement) => placement.offerletterpublicid)
        .filter((publicId) => publicId !== null && publicId !== undefined);

      if (offerLetterPublicId.length > 0) {
        for (const id of offerLetterPublicId) {
          await cloudinary.uploader.destroy(id, (error, result) => {
            if (error) {
              console.log("Error deleting file:", error);
            }
          });
        }
      }

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
  updateUserByAdmin,
  updateUserByUser,
  uploadResume,
  getAppliedPlacementsById,
  deleteUser,
};
