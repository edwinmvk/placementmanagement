import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";

const { sign, verify } = jwt;
dotenv.config();

export const createAdminToken = (adminObj) => {
  // we can store many fields in the payload (ie, the 1st parameter) of sign function
  const accessToken = sign(
    { username: adminObj.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return accessToken;
};

export const validateAdminJwt = (req, res, next) => {
  // we are only taking the appropriate access token from the cookies object
  const accessToken = req.cookies["jwtAdminAccessTokenCookie"];

  // checks if there is access token in the req from frontend
  if (!accessToken) {
    // No appropriate cookies in request
    return res.status(400).json("Session expired. Please login again");
  }
  try {
    const validToken = verify(accessToken, process.env.JWT_SECRET);
    if (validToken) {
      // we simple set new variables in the req, and these variables can be further accessed in the controllers
      req.authenticated = true;
      return next();
    }
  } catch (error) {
    // The else statment of if condition is actually in the catch statment. It is expired jwt
    return res.status(400).json("Session expired. Please login again");
  }
};

export const checkReloadAdminJwt = async (req, res) => {
  try {
    if (req.authenticated === true) {
      return res.status(200).json("JWT is valid");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAdminCookie = async (req, res) => {
  return res
    .status(202)
    .clearCookie("jwtAdminAccessTokenCookie")
    .json("jwtAdminAccessTokenCookie is cleared");
};
