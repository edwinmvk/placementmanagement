import mongoose from "mongoose";
import appliedPlacementsModel from "../mongodb/models/appliedPlacementsModel.js";
import userModel from "../mongodb/models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";

const getAllPlacementIds = async (req, res) => {
  // this function returns an array of objects containing all the unique placement ids along with their names
  try {
    const data = await appliedPlacementsModel.aggregate([
      {
        $group: {
          _id: "$placementid",
          companyname: { $first: "$companyname" },
        },
      },
    ]);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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

const getPlacedNumber = async (req, res) => {
  try {
    const allApplied = await appliedPlacementsModel.find({});
    const placed = allApplied.filter((placemnt) => {
      return placemnt.status === "You have been Placed";
    });
    return res.status(200).json(placed.length);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPlacementsById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await appliedPlacementsModel
      .find({ placementid: id })
      .populate("creator");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePlacementsOfferLetter = async (req, res) => {
  let offerLetterUrl = null;
  let offerLetterId = null;
  try {
    const { id } = req.params;
    const { placementid } = req.body;

    // this is for replacng the already uploaded offer letter
    if (req.body.offerletterpublicid) {
      const { offerletterpublicid } = req.body;
      if (req.file) {
        const { path } = req.file;
        const replacedOfferLetter = await cloudinary.uploader.upload(path, {
          public_id: offerletterpublicid,
          overwrite: true, // Overwrite the existing file
        });
        offerLetterUrl = replacedOfferLetter.secure_url;
        offerLetterId = replacedOfferLetter.public_id;
        await fs.unlink(path);
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Find the user by userid and populate the appliedplacements
        const user = await userModel
          .findOne({ userid: id })
          .populate("appliedplacements")
          .session(session);

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Find the appliedplacement that matches the offerletter's creator (user)
        const matchedAppliedPlacement = user.appliedplacements.find(
          (placement) => placementid === placement.placementid
        );

        // Update the offerletterurl for the found matchedAppliedPlacement
        matchedAppliedPlacement.offerletterurl = offerLetterUrl;
        matchedAppliedPlacement.offerletterpublicid = offerLetterId;

        // Save the changes to the matchedAppliedPlacement
        await matchedAppliedPlacement.save();

        await session.commitTransaction();
        return res.status(200).json(`Offer letter to ${id} is updated`);
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
        const uploadedOfferLetter = await cloudinary.uploader.upload(path);
        offerLetterUrl = uploadedOfferLetter.secure_url;
        offerLetterId = uploadedOfferLetter.public_id;
        await fs.unlink(path);
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const user = await userModel
          .findOne({ userid: id })
          .populate("appliedplacements")
          .session(session);

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Find the appliedplacement that matches the offerletter's creator (user)
        const matchedAppliedPlacement = user.appliedplacements.find(
          (placement) => placementid === placement.placementid
        );

        // Update the offerletterurl for the found matchedAppliedPlacement
        matchedAppliedPlacement.offerletterurl = offerLetterUrl;
        matchedAppliedPlacement.offerletterpublicid = offerLetterId;

        // Save the changes to the matchedAppliedPlacement
        await matchedAppliedPlacement.save();

        await session.commitTransaction();
        return res.status(200).json(`Offer letter sent to ${id}`);
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

const updatePlacementsStatus = async (req, res) => {
  try {
    const { id } = req.params; // this is the userid
    const { placementid } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // find all the placements with placementid
      const allPlacementWithId = await appliedPlacementsModel
        .find({ placementid: placementid })
        .populate("creator")
        .session(session);

      // filter the placements applied by the specific user (actually the array will only contain one placement)
      const placementsByEachUserId = allPlacementWithId.filter(
        (placement) => placement.creator.userid == id // here we use == instead if === since the type of id is string. So we need type coercion
      );

      // Update status in each placement. For each mutates the array. So the dont need a return keyword
      placementsByEachUserId.forEach((placement) => {
        placement.status = req.body.status;
      });

      // Save the changes to the database
      await Promise.all(
        placementsByEachUserId.map((placement) => {
          return placement.save();
        })
      ).catch((error) => {
        console.log("An error occurred:", error);
        throw error;
      });

      await session.commitTransaction();
      return res.status(200).json("Status updated");
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
  getAllPlacementIds,
  createPlacements,
  getPlacedNumber,
  getPlacementsById,
  updatePlacementsOfferLetter,
  updatePlacementsStatus,
};
