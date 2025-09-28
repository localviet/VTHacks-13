import mongoose from "mongoose";
const corpsOfferSchema = new mongoose.Schema(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CreatorUser",
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CorpUser",
      required: true,
    },
    fromName: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      maxLength: 1500,
      required: true,
    },
    salary: { type: Number, required: true },
    status: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
    },
  },

  { timestamps: true }
);

export default mongoose.model("CorpsOffer", corpsOfferSchema);
