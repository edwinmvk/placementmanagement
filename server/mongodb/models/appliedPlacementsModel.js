import mongoose from "mongoose";

const AppliedPlacementsSchema = new mongoose.Schema({
  placementid: { type: String, required: true },
  companyname: { type: String, required: true },
  status: { type: String, required: true },
  cgpa: { type: Number, required: true },
  arrears: { type: Number, required: true },
  passoutyear: { type: Number, required: true },
  resumeurl: { type: String, required: true },
  offerletterurl: { type: String },
  offerletterpublicid: { type: String },
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
