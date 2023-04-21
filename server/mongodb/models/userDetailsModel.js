import mongoose from "mongoose";

const UserDetailsSchema = new mongoose.Schema({
  avatar: { type: String, required: true },
  arrears: { type: Number, required: true },
  cgpa: { type: Number, required: true },
  passoutyear: { type: Number, required: true },
  resume: { type: String },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const userDetailsModel = mongoose.model("UserDetails", UserDetailsSchema);

export default userDetailsModel;
