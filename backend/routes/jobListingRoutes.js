import express, { Router } from "express";
import {
  createJobListing,
  getAllJobListings,
  //getJobListingById,
  //updateJobListing,
  //deleteJobListing,
} from "../controllers/jobListingController.js";
import { authenticateCorpToken } from "../controllers/userAccountController.js";

const jobListingRouter = Router();

jobListingRouter.post(
  "/create-job-listing",
  authenticateCorpToken,
  createJobListing
);
jobListingRouter.get("/all-job-listings", getAllJobListings);
//jobListingRouter.get("/job-listing/:id", getJobListingById);
export default jobListingRouter;
