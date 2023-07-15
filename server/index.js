import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { readFileSync } from "fs";

import connectDB from "./mongodb/connectDB/connectDB.js";
import userRouter from "./routes/userModel.routes.js";
import appliedPlacementsRouter from "./routes/appliedPlacementsModel.routes.js";
import adminRouter from "./routes/adminModel.routes.js";
import placementsRouter from "./routes/placementsModel.routes.js";
import userNotificationsRouter from "./routes/userNotificationModel.routes.js";
import adminNotificationRouter from "./routes/adminNotificationModel.routes.js";

dotenv.config();

const app = express();

const domainData = readFileSync("./Domain.json", "utf8");
const Domain = JSON.parse(domainData);

app.use(
  cors({
    origin: Domain.clientaddress,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: false,
  })
);
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Hi");
});

app.use("/api/user", userRouter);
app.use("/api/appliedplacements", appliedPlacementsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/placements", placementsRouter);
app.use("/api/usernotifications", userNotificationsRouter);
app.use("/api/adminnotifications", adminNotificationRouter);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // connect to database
    await connectDB(process.env.MONGODB_URL);

    // the server wil not run if the connectDB fails due to await
    app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
  } catch (error) {
    console.error("Server cannot start:", error);
  }
};

startServer();
