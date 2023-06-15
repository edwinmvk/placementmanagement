import adminModel from "../mongodb/models/adminModel.js";
import placementsModel from "../mongodb/models/placementsModel.js";
import userModel from "../mongodb/models/userModel.js";
import mongoose from "mongoose";

const getPlacements = async (req, res) => {
  try {
    const placements = await placementsModel.find({});
    return res.status(200).json(placements);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPlacementsById = async (req, res) => {
  try {
    const { id } = req.params;

    // get all the placements from placement model
    const allPlacements = await placementsModel.find({});

    // // get all the placements applied by this user from applied placement model
    // const appliedPlacements = await appliedPlacementsModel.find({
    //   placementid: id,
    // });

    // get all the placements applied by this user from user model
    const studentDetail = await userModel
      .findOne({ userid: id })
      .populate("appliedplacements");

    // Extract the placement IDs from the applied placements
    const appliedPlacementIds = studentDetail.appliedplacements.map(
      (placement) => placement.placementid
    );

    // seperate the applied placements from nonapplied placements using the applied placement's id
    const filteredPlacements = allPlacements.filter((placement) => {
      return !appliedPlacementIds.includes(placement.placementid);
    });

    // again filter the filtered placements based on cgpa
    const cgpaFiltered = filteredPlacements.filter((placement) => {
      return studentDetail.cgpa >= placement.cgpa;
    });

    // filter the cgpafiltered based on arrears
    const arrearsFiltered = cgpaFiltered.filter((placement) => {
      return studentDetail.arrears <= placement.arrears;
    });

    // filter the arrearsfiltered based on passout year
    const passoutyearFiltered = arrearsFiltered.filter((placements) => {
      return studentDetail.passoutyear === placements.passoutyear;
    });

    // finally filter based on dates
    const formeFiltered = passoutyearFiltered.filter((placements) => {
      const currentDate = new Date();
      const convertedLastDate = new Date(placements.lastdate);
      return currentDate <= convertedLastDate;
    });

    return res.status(200).json(formeFiltered);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
      passoutyear,
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
        passoutyear,
        description,
        creator: adminObj._id,
      });

      // also update the adminObj
      adminObj.placements.push(newPlacement._id);

      // .SAVE() is required in transaction during the creation and updation of data in database
      await adminObj.save({ session });

      await session.commitTransaction();

      return res.status(200).json("Placement created successfully");
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

const deletePlacements = async (req, res) => {};

export { createPlacements, deletePlacements, getPlacements, getPlacementsById };
