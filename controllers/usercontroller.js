import UserHotel from "../models/UserModel.js";
import { createError } from "../utils/error.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await UserHotel.find();
    res.status(200).json(users);
  } catch (err) {
    next(
      createError(401, "error making get request", "enter find useres yaself")
    );
  }
};
export const get = async (req, res, next) => {
  try {
    const user = await UserHotel.findById(req.params.id);
    console.log(user);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await UserHotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res) => {
  try {
    await UserHotel.findByIdAndDelete(req.params.id);

    res.status(200).json("User has been deleted");
  } catch (err) {
    next(err);
  }
};
