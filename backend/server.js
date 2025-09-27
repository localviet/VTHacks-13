import { connectDB } from "./config/db.js";
import express, { Router } from "express";
import dotenv from "dotenv";

dotenv.config();

//express app
const app = express();
const apiRouter = Router();
const PORT = process.env.PORT || 5001;

//middleware
app.use(express.json()); //to be able to send json data

//app.use("/api/", Router);
// connect to db
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT: ", PORT);
  });
});
