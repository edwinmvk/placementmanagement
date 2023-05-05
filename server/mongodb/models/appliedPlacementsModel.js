import mongoose from "mongoose";

const AppliedPlacementsSchema = new mongoose.Schema({
  placementid: { type: String, required: true },
  status: { type: String, required: true },
  resume: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userschema",
  },
});

const appliedPlacementsModel = mongoose.model(
  "appliedplacementsschema",
  AppliedPlacementsSchema
);

export default appliedPlacementsModel;
