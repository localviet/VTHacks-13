import mongoose from "mongoose";

const creatorUserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, "Please add a first name"] },
    lastName: { type: String, required: [true, "Please add a last name"] },

    phoneNumber: {
      type: String,
      required: [true, "Please add a phone number"],
      unique: true,
      match: [/^\d{10}$/, "Please add a valid phone number"],
    },

    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    bio: {
      type: String,
      maxlength: 300,
    },

    instagram: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    youtube: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    tiktok: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    offers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Offer",
      default: [],
    },

    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

creatorUserSchema.pre("validate", function (next) {
  const hasAnySocial =
    (this.instagram && this.instagram.trim()) ||
    (this.youtube && this.youtube.trim()) ||
    (this.tiktok && this.tiktok.trim());

  if (!hasAnySocial) {
    this.invalidate(
      "social",
      "At least one social media account (Instagram, YouTube, or TikTok) is required."
    );
  }
  next();
});

export default mongoose.model("CreatorUser", creatorUserSchema);
