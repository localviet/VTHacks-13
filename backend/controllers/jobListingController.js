import express, { Router } from "express";
import JobListing from "../models/JobListingModel.js";
const createJobListing = (req, res) => {
  console.log("Creating job listing...");
  if (req.user.userType !== "CorpUser") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const { title, desc, salaryRange } = req.body;
  const jobListingData = {
    title: title,
    desc: desc,
    salaryRange: salaryRange,
    postedBy: req.user._id,
  };
  console.log(jobListingData);
  JobListing.create(jobListingData)
    .then((jobListing) => {
      return res
        .status(201)
        .json({ message: "Job listing created", jobListing: jobListing });
    })
    .catch((error) => {
      console.error("Error creating job listing:", error);
      return res.status(500).json({ message: "Server error" });
    });
};
const getAllJobListings = async (req, res) => {
  try {
    // Get page and limit from query params (default: page 1, limit 10)
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // Count total documents
    const total = await JobListing.countDocuments();

    // Fetch with skip/limit for pagination
    const jobListings = await JobListing.find()
      .sort({ createdAt: -1 }) // newest first
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("postedBy", "name email"); // optional: include CorpUser info

    res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      jobListings,
    });
  } catch (error) {
    console.error("Error fetching job listings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//jobListingRouter.get("/all-job-listings", getAllJobListings);
//jobListingRouter.get("/job-listing/:id", getJobListingById);
export { createJobListing, getAllJobListings };
