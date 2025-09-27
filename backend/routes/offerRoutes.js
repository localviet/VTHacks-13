import { createOffer } from "../controllers/offerController.js";
import { Router } from "express";
import {
  authenticateCorpToken,
  authenticateCreatorToken,
} from "../controllers/userAccountController.js";
const offerRouter = Router();

offerRouter.post("/create-offer", authenticateCorpToken, createOffer);

export default offerRouter;
