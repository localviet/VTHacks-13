import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import RefreshToken from "../models/RefreshTokenModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const generateAccessToken = (userData) => {
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};
const generateRefreshToken = (userData) => {
  return jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1y",
  });
};
const login = asyncHandler(async (req, res) => {
  console.log("Login attempt...");
  const { phoneNumber, email, password } = req.body;
  if ((!phoneNumber || !email) && !password) {
    return res
      .status(400)
      .json({ message: "Phone/Email and password are required" });
  }
  console.log("finding user", phoneNumber, email);
  let user;
  if (phoneNumber) {
    console.log(phoneNumber);
    user = await User.findOne({ phoneNumber: phoneNumber });
    console.log("User found by phone:", user);
  } else if (email) {
    console.log(email);
    user = await User.findOne({ email: email });
  } else {
    console.log("No phone or email provided");
    return res
      .status(400)
      .json({ message: "No user found with that phone or email" });
  }
  console.log("User found:", user);
  const phoneOrEmail = phoneNumber || email;

  if (user && (await bcrypt.compare(password, user.password))) {
    const userData = { user: phoneOrEmail };
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    console.log("Hashed refresh token:", hashedRefreshToken);
    if (await RefreshToken.findOne({ userId: user._id })) {
      console.log("Updating existing refresh token for user:", user._id);

      await RefreshToken.findOneAndUpdate(
        { userId: user._id },
        { $set: { RefreshToken: hashedRefreshToken } },
        { new: true }
      );
    } else {
      console.log("Creating new refresh token for user:", user._id);
      await RefreshToken.create({
        userId: user._id,
        RefreshToken: hashedRefreshToken,
      });
    }

    return res
      .status(200)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  }
});

const refresh = asyncHandler(async (req, res) => {
  console.log("Refreshing token...");
  if (req.body.refreshToken == null) return res.sendStatus(401);
  const storedToken = await RefreshToken.findOne({
    userId: req.body.userId,
  });
  console.log("Stored token:", storedToken.RefreshToken);
  console.log("Request body token:", req.body.refreshToken);
  const tokenMatches = await bcrypt.compare(
    req.body.refreshToken,
    storedToken.RefreshToken
  );
  console.log("Token matches:", tokenMatches);
  if (!tokenMatches) return res.sendStatus(403);
  jwt.verify(
    req.body.refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({ user: user.user });
      res.json({ accessToken: accessToken });
    }
  );
});

export { login, refresh };
