import mongoose from "mongoose";
const offerSchema = new mongoose.Schema(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CreatorUser",
      unique: true,
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CorpUser",
      unique: true,
      required: true,
    },
    desc: {
      type: String,
      maxLength: 1500,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);
