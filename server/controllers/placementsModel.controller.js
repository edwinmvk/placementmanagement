import adminModel from "../mongodb/models/adminModel.js";
import placementsModel from "../mongodb/models/placementsModel.js";
import mongoose from "mongoose";

const getPlacements = async (req, res) => {
  try {
    const placements = await placementsModel.find({});
    res.status(200).json(placements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createPlacements = async (req, res) => {
  try {
    const {
      arrears,
      companyname,
      cgpa,
      description,
      createdate,
      lastdate,
      placementid,
      semester,
    } = req.body;

    // findOne is used to obtain the 1st object from that schema
    const adminObj = await adminModel.findOne();

    if (!adminObj) {
      return res.status(404).json("No admin in database");
    }

    // start a new session for atomicity property

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // create a new placement in the database and provide reference with the adminObj
      const newPlacement = await placementsModel.create({
        companyname,
        createdate,
        placementid,
        lastdate,
        cgpa,
        arrears,
        semester,
        description,
        creator: adminObj._id,
      });

      // also update the adminObj
      adminObj.placements.push(newPlacement._id);

      // .SAVE() is required in transaction during the creation and updation of data in database
      await adminObj.save({ session });

      await session.commitTransaction();

      res.status(200).json("Placement created successfully");
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePlacements = async (req, res) => {};

export { createPlacements, deletePlacements, getPlacements };
