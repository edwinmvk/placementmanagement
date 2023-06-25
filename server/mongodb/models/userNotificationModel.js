import mongoose from "mongoose";

const UserNotificationSchema = new mongoose.Schema({
  userid: { type: Number, required: true },
  description: { type: String, required: true },
});

const userNotificationModel = mongoose.model(
  "usernotificationschema",
  UserNotificationSchema
);

export default userNotificationModel;
