import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userid: { type: Number, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  passoutyear: { type: Number, required: true },
  arrears: { type: Number, required: true },
  cgpa: { type: Number, required: true },
  avatar: { type: String },
  appliedplacements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AppliedPlacementsSchema",
    },
  ],
});

const userModel = mongoose.model("User", UserSchema);

export default userModel;
