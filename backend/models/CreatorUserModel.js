import mongoose from "mongoose";

const creatorUserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, "Please add a first name"] },
    lastName: { type: String, required: [true, "Please add a last name"] },

    email: {
      type: String,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email address",
      ],
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
      sparse: true,
      trim: true,
    },
    youtube: {
      type: String,
      sparse: true,
      trim: true,
    },
    tiktok: {
      type: String,
      sparse: true,
      trim: true,
    },

    offers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "CorpsOffer",
      default: [],
    },

    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

// creatorUserSchema.pre("validate", function (next) {
//   const hasAnySocial =
//     (this.instagram && this.instagram.trim()) ||
//     (this.youtube && this.youtube.trim()) ||
//     (this.tiktok && this.tiktok.trim());

//   if (!hasAnySocial) {
//     this.invalidate(
//       "social",
//       "At least one social media account (Instagram, YouTube, or TikTok) is required."
//     );
//   }
//   next();
// });

export default mongoose.model("CreatorUser", creatorUserSchema);
