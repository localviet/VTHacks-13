import bcrypt, { hash } from "bcrypt";
import asyncHandler from "express-async-handler";
import CreatorUser from "../models/CreatorUserModel.js";
import RefreshToken from "../models/RefreshTokenModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import CorpUser from "../models/CorpUserModel.js";

dotenv.config();

// Generate JWT
const generateAccessToken = (userData) => {
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1y",
  });
};

// Generate Refresh Token
const generateRefreshToken = (userData) => {
  return jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1y",
  });
};

// @desc    Login user
// @route   GET /api/user/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  console.log("Login attempt...");
  console.log(req.query);
  const { email, password } = req.query;
  if (!email && !password) {
    return res.status(400).json({ message: "Phone and password are required" });
  }
  console.log("finding user", email);

  let user = await CreatorUser.findOne({ email: email });
  let userType = "CreatorUser";
  if (!user) {
    user = await CorpUser.findOne({ email: email });
    userType = "CorpUser";
  }
  console.log("User found by email:", user);
  console.log(user.password);
  if (user && (await bcrypt.compare(password, user.password))) {
    const userData = { _id: user._id, userType: userType };
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
      userId: user._id,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }
  return res.status(400).json({
    message: "wrong password",
  });
});

// @desc    Register new user
// @route   POST /api/user/register
// @access  Public
const creatorUserRegister = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    bio,
    youtube,
    instagram,
    tiktok,
    followers,
  } = req.body;
  console.log("in creator register with", req.body);
  if (!firstName || !lastName || !email || !password || !followers) {
    return res.status(400).json({ message: "all fields are required" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userData = {
    firstName: firstName,
    email: email,
    lastName: lastName,
    password: hashedPassword,
    followers: followers,
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

// @desc    Register new corp user
// @route   POST /api/user/corpRegister
// @access  Public
const corpUserRegister = asyncHandler(async (req, res) => {
  const { businessName, email, password, website } = req.body;
  console.log("in corp register with", req.body);
  if (!businessName || !password || !email || !website) {
    return res.status(400).json({ message: "all fields are required" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const corpData = {
    name: businessName,
    password: hashedPassword,
    email: email,
  };

  const corp = await CorpUser.create(corpData);
  return res.status(201).json({
    message: "Password registered, corp user created successfully",
    corp: {
      name: `${businessName}`,
      corpId: corp._id,
    },
  });
});

//  @desc    Refresh access token
//  @route   POST /api/user/refresh
//  @access  Public
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
  // Verify the refresh token
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

// @desc    Get all users (creators and corp users)
// @route   GET /api/users
// @access  Public (adjust with auth if needed)
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const creators = await CreatorUser.find().select("-password");
    const corps = await CorpUser.find().select("-password");
    return res.status(200).json({ creators, corps });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// @desc    Get user by id (search creators and corps)
// @route   GET /api/users/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Missing id parameter" });

    let user = await CreatorUser.findById(id)
      .select("-password")
      .populate("offers");
    let userType = "CreatorUser";
    if (!user) {
      user = await CorpUser.findById(id).select("-password").populate("offers");
      userType = "CorpUser";
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user, userType });
  } catch (error) {
    console.error("Error fetching user by id:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Middleware to authenticate CorpUser
function authenticateCorpToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    //if (user.userType != "CorpUser") return res.sendStatus(403);
    req.user = user;
    next();
  });
}
function solveJWT(req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json({ message: "No token provided" });

  // Verify the token and return the decoded payload
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("solveJWT verify error:", err);
      return res
        .status(403)
        .json({ message: "Invalid token", error: err.message });
    }
    // decoded contains the payload used when signing (e.g. {_id, userType, iat, exp})
    return res.status(200).json({ decoded });
  });
}
// function authenticateCreatorToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     console.log(err);
//     if (err) return res.sendStatus(403);
//     if (user.userType != "CreatorUser") return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }

export {
  login,
  creatorUserRegister,
  corpUserRegister,
  refresh,
  getAllUsers,
  getUserById,
  authenticateCorpToken,
  solveJWT,
  // authenticateCreatorToken,
};
