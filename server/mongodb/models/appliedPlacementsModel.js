import mongoose from "mongoose";

const AppliedPlacementsSchema = new mongoose.Schema({
  placementid: { type: String, required: true },
  status: { type: String, required: true },
  resume: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const appliedPlacementsModel = mongoose.model(
  "AppliedPlacements",
  AppliedPlacementsSchema
);

export default appliedPlacementsModel;
