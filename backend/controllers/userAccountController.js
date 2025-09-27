import bcrypt, { hash } from "bcrypt";
import asyncHandler from "express-async-handler";
import CreatorUser from "../models/CreatorUserModel.js";
import RefreshToken from "../models/RefreshTokenModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import CorpUser from "../models/CorpUserModel.js";

dotenv.config();

// const logout = asyncHandler(async (req, res) => {
//   const { }
// });

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
  const { phoneNumber, password } = req.body;
  if (!phoneNumber && !password) {
    return res.status(400).json({ message: "Phone and password are required" });
  }
  console.log("finding user", phoneNumber);

  let user = await CreatorUser.findOne({ phoneNumber: phoneNumber });
  let userType = "CreatorUser";
  if (!user) {
    user = await CorpUser.findOne({ phoneNumber: phoneNumber });
    userType = "CorpUser";
  }
  console.log("User found by phone:", user);
  console.log(user.password);
  if (user && (await bcrypt.compare(password, user.password))) {
    const userData = { user: phoneNumber, userType: userType };
    console.log("generating access & refresh");
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);
    console.log("finished generating access & refresh");
    const salt = await bcrypt.genSalt(10);
    console.log("salt made");
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

    return res.status(200).json({
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }
  return res.status(400).json({
    message: "wrong password",
  });
});

const creatorUserRegister = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    password,
    bio,
    youtube,
    instagram,
    tiktok,
  } = req.body;
  if (!firstName || !lastName || !phoneNumber || !password) {
    return res.status(400).json({ message: "all fields are required" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userData = {
    firstName: firstName,
    phoneNumber: phoneNumber,
    lastName: lastName,
    password: hashedPassword,
  };

  if (bio) userData.bio = bio;
  if (youtube) userData.youtube = youtube;
  if (instagram) userData.instagram = instagram;
  if (tiktok) userData.tiktok = tiktok;
  console.log(userData);
  const user = await CreatorUser.create(userData);
  return res.status(201).json({
    message: "Password registered, user created successfully",
    user: {
      fullName: `${user.firstName} ${user.lastName}`,
      userId: user._id,
    },
  });
});

const corpUserRegister = asyncHandler(async (req, res) => {
  const { name, password, email, phone } = req.body;
  if (!name || !password || !email || !phone) {
    return res.status(400).json({ message: "all fields are required" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const corpData = {
    name: name,
    password: hashedPassword,
    email: email,
    phone: phone,
  };

  const corp = await CorpUser.create(corpData);
  return res.status(201).json({
    message: "Password registered, corp user created successfully",
    corp: {
      name: `${name}`,
      corpId: corp._id,
    },
  });
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

function authenticateCorpToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    if (user.userType != "CorpUser") return res.sendStatus(403);
    req.user = user;
    next();
  });
}
function authenticateCreatorToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    if (user.userType != "CreatorUser") return res.sendStatus(403);
    req.user = user;
    next();
  });
}

export {
  login,
  creatorUserRegister,
  corpUserRegister,
  refresh,
  authenticateCorpToken,
  authenticateCreatorToken,
};
