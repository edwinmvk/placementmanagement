import mongoose from "mongoose";

const AdminNotificationSchema = new mongoose.Schema({
  creator: { type: Number, required: true },
  description: { type: String, required: true },
});

const adminNotificationModel = mongoose.model(
  "adminnotificationschema",
  AdminNotificationSchema
);

export default adminNotificationModel;
