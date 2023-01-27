import express from "express";
import {
  deleteUser,
  get,
  getUsers,
  updateUser,
} from "../controllers/usercontroller.js";
import { verifyAdmin, verifyUser } from "../middleware/auth.js";

const router = express.Router();

router.get(`/check`, verifyUser, (req, res, next) => {
  res.send("hello user your logged in");
});

// router.get("/checkuser/:id", verifyAdmin, (req, res, next) => {
//   res.send("hello user your not verified");
// });

router.get("/", verifyAdmin, getUsers);
router.get("/:id", verifyUser, get);
router.put("/:id", verifyUser, updateUser);
router.delete("/:id", verifyUser, deleteUser);

export default router;
