import mongoose from "mongoose";

const connectDB = async (mongodbURL) => {
  // strictQuery means that queries with undefined fields will throw an error instead of ignoring them
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(mongodbURL);
    // show msg if the connection is successful with mongodb
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    // if we didn't throw error, the server will start even if the mongodb connection fails
    throw error;
  }
};

export default connectDB;
