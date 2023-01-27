import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
// import cookieParser from "cookie-parser";

import hotelsRoute from "./routes/hotelsroute.js";
import authRoute from "./routes/authroute.js";
import usersRoutes from "./routes/usersroutes.js";

mongoose.set("strictQuery", true);
const app = express();
// app.use(cookieParser());

dotenv.config();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// app.use(express.json()) enabling sending JSON format middleware

app.use("/api/auth", authRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/users", usersRoutes);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "something went wrong";
  return res.status(errorStatus).json({
    success: false,
    errorStatus: errorStatus,
    message: errorMessage,
    stack: err.stack,
    ndu: err.ndu,
  });
  // res.send("hey i am a middle ware");
  // next();
});

const connect = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URL);
    console.log("connected to mongodb");
  } catch (error) {
    throw error;
  }
};

app.listen(5000, () => {
  connect();
  console.log("connected to server");
});
