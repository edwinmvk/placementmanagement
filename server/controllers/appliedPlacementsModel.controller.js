import mongoose from "mongoose";
import appliedPlacementsModel from "../mongodb/models/appliedPlacementsModel.js";
import userModel from "../mongodb/models/userModel.js";

const getAllPlacements = async (req, res) => {};
const getPlacementsById = async (req, res) => {};

const createPlacements = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      placementid,
      companyname,
      status,
      cgpa,
      arrears,
      passoutyear,
      resumeurl,
    } = req.body;

    // find the user who applied the placement
    const userObj = await userModel.findOne({
      userid: id,
    });

    if (!userObj) {
      return res.status(404).json("No user in database");
    }

    // start a new session for atomicity property
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // create a new appliedplacement in the database and provide reference with the userObj
      const newAppliedPlacement = await appliedPlacementsModel.create({
        placementid,
        companyname,
        status,
        cgpa,
        arrears,
        passoutyear,
        resumeurl,
        creator: userObj._id,
      });

      // also update the userObj
      userObj.appliedplacements.push(newAppliedPlacement._id);

      await userObj.save({ session });

      await session.commitTransaction();
      return res.status(200).json("Application recieved for preliminary round");
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

const updatePlacements = async (req, res) => {};
const deletePlacements = async (req, res) => {};

export {
  getAllPlacements,
  getPlacementsById,
  createPlacements,
  updatePlacements,
  deletePlacements,
};
