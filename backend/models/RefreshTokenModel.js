import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  RefreshToken: String, // ideally hashed
});

export default mongoose.model("RefreshToken", refreshTokenSchema);
