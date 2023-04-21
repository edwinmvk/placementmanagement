import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connectDB/connectDB.js";
import userRouter from "./routes/userModel.routes.js";
import userDetailsRouter from "./routes/userDetailsModel.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Hi");
});

app.use("/api/user/profile", userRouter);
app.use("/api/user/details", userDetailsRouter);

const startServer = async () => {
  try {
    // connect to database
    connectDB(process.env.MONGODB_URL);

    app.listen(3000, () => console.log("Server started at port 3000"));
  } catch {
    console.log(error);
  }
};

startServer();
