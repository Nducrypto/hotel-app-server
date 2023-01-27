import bcrypt from "bcryptjs";
import UserHotel from "../models/UserModel.js";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new UserHotel({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });

    await newUser.save();
    res.status(200).send("user created successfully");
  } catch (err) {
    next(err);
  }
};

// LOGIN

export const login = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    // USERNAME ERROR CUSTOMIZATION
    const existingUser = await UserHotel.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!existingUser) return next(createError(404, "User Not Found"));

    // const existingUser = await UserHotel.findOne({
    //   username: username,
    // });

    // PASSWORD ERROR CUSTOMIZATION
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );

    if (!isPasswordCorrect) return next(createError(400, "Wrong Password"));

    const token = jwt.sign(
      { id: existingUser._id, isAdmin: existingUser.isAdmin },
      process.env.JWT_SECRET
    );
    // preventing password and isAdmin from appearin on browser console
    const { password, isAdmin, ...otherDetails } = existingUser._doc;

    // .cookie(`access_token`, token)
    res.status(200).json({ result: { ...otherDetails }, token });
  } catch (err) {
    next(createError(404, "failed to login"));
  }
};
