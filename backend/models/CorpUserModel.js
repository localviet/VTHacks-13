import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter the name of your company"],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Enter a valid email"],
  },
  //phone: { type: String, trim: true, required: true, unique: true },
  website: { type: String, trim: true },
  instagram: { type: String, trim: true },
  tiktok: { type: String, trim: true },
  youtube: { type: String, trim: true },
  facebook: { type: String, trim: true },
  x: { type: String, trim: true },
  linkedin: { type: String, trim: true },
});

const CorpUser = mongoose.model("CorpUser", CompanySchema);

export default CorpUser;
