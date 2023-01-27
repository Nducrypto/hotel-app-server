import express from "express";
import {
  getHotels,
  createHotel,
  get,
  updateHotel,
  deleteHotel,
  countByCity,
  countByType,
  getRooms,
  createRoom,
  updateRoomAvailability,
} from "../controllers/hotelcontroller.js";
import { verifyAdmin, verifyUser } from "../middleware/auth.js";

const router = express.Router();

// GET ALL
router.get("/", getHotels);
router.get("/find/:id", get);
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.put("/availability/:id", updateRoomAvailability);
router.get("/room/:id", getRooms);
router.post("/", createHotel);
router.post("/createRoom/:hotelId", createRoom);
router.put("/:id", verifyAdmin, updateHotel);
router.delete("/:id", deleteHotel);

export default router;
