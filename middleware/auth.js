import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // const token = req.cookies.access_token;

    if (!token)
      return next(createError(401, "you dont have a token to do this"));

    const existingUser = jwt.verify(token, process.env.JWT_SECRET);
    console.log(existingUser);

    if (!existingUser) return next(createError(402, "token is not valid"));

    if (existingUser.id === req.params.id || existingUser.isAdmin) {
      next();
    } else {
      return next(createError(403, "your not authorized"));
    }
  } catch (err) {
    next(createError(405, "failed"));
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token)
      return next(createError(401, "you dont have a token to do this"));

    const existingUser = jwt.verify(token, process.env.JWT_SECRET);
    if (!existingUser) return next(createError(402, "token is not valid"));

    // req.user = existingUser;
    if (existingUser.isAdmin) {
      next();
    } else {
      return next(createError(405, "your not an Admin"));
    }
  } catch (err) {
    next(createError(405, "failed"));
  }
};

// const token = req.headers.authorization.split(" ")[1];
// const isCustomAuth = token.length < 500;

// // const token = req?.cookies?.access_token;

// console.log(isCustomAuth);
// if (!token) {
//   return next(createError(401, "you dont have a token to do this"));
// }

// // let existingUser;

// // if (token && isCustomAuth) {
// //   existingUser = jwt.verify(token, process.env.JWT_SECRET);
// //   if (!existingUser) return next(createError(402, "token is not valid"));

// //   req.user = existingUser;
// //   next();
// // }
// const existingUser = jwt.verify(token, process.env.JWT_SECRET);
// if (!existingUser) return next(createError(402, "token is not valid"));
// req.user = existingUser;

// next();

// // OR USE THIS FORMULAR, THEY ARE ALL THESAME
// // if dr is token it doesnt means its correct so let verify
// // jwt.verify(token, process.env.JWT_SECRET, (err, existingUser) => {
// //   if (err) return next(createError(409, "token is not valid"));
// //   // if there is no error then return
// //   req.existingUser = existingUser;
// //   next();
// // });
