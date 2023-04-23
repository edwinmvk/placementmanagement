import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  //   createplacements: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "createplacementschema",
  //     },
  //   ],
});

const adminModel = mongoose.model("adminschema", AdminSchema);

export default adminModel;
