import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: Number, required: true },
  name: { type: Number, required: true },
  email: { type: String, required: true },
  details: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDetailsSchema",
  },
});

const userModel = mongoose.model("User", UserSchema);

export default userModel;
