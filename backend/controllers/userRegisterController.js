import TempUser from "../models/TempUserModel.js";
import User from "../models/UserModel.js";
import asyncHandler from "express-async-handler";
import bcrypt, { hash } from "bcryptjs";

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber, password } = req.body;
  if (!firstName || !lastName || !phoneNumber || !password) {
    return res.status(40);
  }
});
const nameRegister = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ message: "First name and last name are required" });
  }
  const user = await TempUser.create({ firstName, lastName });
  res
    .status(201)
    .json({ fullName: `${firstName} ${lastName}`, userId: user._id });
});

const phoneNumberRegister = asyncHandler(async (req, res) => {
  const { userID, phoneNumber } = req.body;
  if (!phoneNumber || !userID) {
    return res
      .status(400)
      .json({ message: "Phone number and user ID are required" });
  }
  const user = await TempUser.findById(userID);
  user["phoneNumber"] = phoneNumber;
  await user.save();
  return res.status(200).json({
    message: "Phone number registered successfully",
    user: {
      fullName: `${user.firstName} ${user.lastName}`,
      phoneNumber: phoneNumber,
      userId: user._id,
    },
  });
});
const passwordRegister = asyncHandler(async (req, res) => {
  console.log("Registering password...");
  const { userID, password } = req.body;
  if (!password || !userID) {
    return res
      .status(400)
      .json({ message: "Password and user ID are required" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await TempUser.findById(userID);
  if (!user || !user.phoneNumber) {
    return res.status(400).json({
      message: "No phone number or no temp user found , how did user get here",
    });
  }
  user["password"] = hashedPassword;
  await user.save();
  const newUser = await tempUsertoUser(userID);
  await TempUser.findByIdAndDelete(userID);
  return res.status(201).json({
    message: "Password registered, user created successfully",
    user: {
      fullName: `${newUser.firstName} ${newUser.lastName}`,
      userId: newUser._id,
    },
  });
});

const tempUsertoUser = async (tempUserID) => {
  console.log("Converting TempUser to User...");
  const tempUser = await TempUser.findById(tempUserID);
  const userData = {
    firstName: tempUser.firstName,
    lastName: tempUser.lastName,
    password: tempUser.password,
  };

  if (tempUser.phoneNumber) {
    userData.phoneNumber = tempUser.phoneNumber;
  }
  if (tempUser.email) {
    userData.email = tempUser.email;
  }

  if (!userData.phoneNumber && !userData.email) {
    throw new Error("TempUser must have either phone number or email");
  }
  console.log(userData);
  const user = await User.create(userData);

  return user;
};
export { nameRegister, phoneNumberRegister, passwordRegister };
