import {
  createCorpsOffer,
  deleteOffer,
  changeOfferStatus,
} from "../controllers/offerController.js";
import { Router } from "express";
import {
  authenticateCorpToken,
  authenticateCreatorToken,
} from "../controllers/userAccountController.js";
const offerRouter = Router();

offerRouter.post("/create-offer", authenticateCorpToken, createCorpsOffer);
offerRouter.delete("/delete-offer", authenticateCorpToken, deleteOffer);

export default offerRouter;
