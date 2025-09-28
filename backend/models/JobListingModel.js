import mongoose from "mongoose";

const jobListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true, maxLength: 2000 },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "CorpUser" },
    tags: { type: [String], default: [] },
    salaryRange: { type: [Number], default: [] }, // [min, max]
  },
  { timestamps: true }
);

export default mongoose.model("JobListing", jobListingSchema);
