import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userid: { type: Number, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  passoutyear: { type: Number, required: true },
  arrears: { type: Number, required: true },
  cgpa: { type: Number, required: true },
  avatar: { type: String, required: true },
  avatarpublicid: { type: String, required: true },
  resumeurl: { type: String },
  resumepublicid: { type: String },
  appliedplacements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appliedplacementsschema",
    },
  ],
});

const userModel = mongoose.model("userschema", UserSchema);

export default userModel;
