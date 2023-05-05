import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  placements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "placementsschema",
    },
  ],
});

const adminModel = mongoose.model("adminschema", AdminSchema);

export default adminModel;
