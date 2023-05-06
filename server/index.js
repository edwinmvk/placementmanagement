import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connectDB/connectDB.js";
import userRouter from "./routes/userModel.routes.js";
import appliedPlacementsRouter from "./routes/appliedPlacementsModel.routes.js";
import adminRouter from "./routes/adminModel.routes.js";
import placementsRouter from "./routes/placementsModel.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Hi");
});

app.use("/api/user", userRouter);
app.use("/api/appliedplacements", appliedPlacementsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/placements", placementsRouter);

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
