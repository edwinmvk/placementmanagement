import mongoose from "mongoose";

const connectDB = (url) => {
  mongoose.set("strictQuery", true);
  // show msg if the connection is successful with mongodb
  mongoose
    .connect(url)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(error));
};

export default connectDB;
