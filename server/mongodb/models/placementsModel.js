import mongoose from "mongoose";

const PlacementsSchema = new mongoose.Schema({
  companyname: { type: String, required: true },
  createdate: { type: String, required: true },
  placementid: { type: String, required: true },
  lastdate: { type: String, required: true },
  cgpa: { type: Number, required: true },
  arrears: { type: Number, required: true },
  passoutyear: { type: Number, required: true },
  description: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adminschema",
  },
});

const placementsModel = mongoose.model("placementsschema", PlacementsSchema);

export default placementsModel;
