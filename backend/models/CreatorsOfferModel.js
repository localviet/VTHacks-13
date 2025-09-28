import mongoose from "mongoose";
const creatorsOfferSchema = new mongoose.Schema(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CorpUser",
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CreatorUser",
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
    status: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
    },
    salary: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("CreatorsOffer", creatorsOfferSchema);
