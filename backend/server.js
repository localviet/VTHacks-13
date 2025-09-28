import { connectDB } from "./config/db.js";
import express, { Router } from "express";
import dotenv from "dotenv";
import apiRouter from "./routes/accountRoutes.js";
import offerRouter from "./routes/offerRoutes.js";
import hashtagRoutes from "./routes/hashtagRoutes.js";
import jobListingRouter from "./routes/jobListingRoutes.js";
import geminiRoutes from './routes/geminiRoutes.js';
import cors from "cors";
dotenv.config();

//express app
const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());
//middleware
app.use(express.json()); //to be able to send json data

app.use("/api/", apiRouter);
// Mount gemini routes
app.use('/api/gemini', geminiRoutes);
// Mount hashtag routes under /gem
app.use("/gem", hashtagRoutes);
app.use("/offer/", offerRouter);
app.use("/job-listing/", jobListingRouter);
// connect to db
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
