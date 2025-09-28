import {
  createCorpsOffer,
  deleteOffer,
  changeOfferStatus,
  getReceivedOffers,
} from "../controllers/offerController.js";
import { Router } from "express";
import {
  authenticateCorpToken,
  authenticateCreatorToken,
} from "../controllers/userAccountController.js";
const offerRouter = Router();

offerRouter.post("/create-offer", authenticateCorpToken, createCorpsOffer);
offerRouter.delete("/delete-offer", authenticateCorpToken, deleteOffer);
offerRouter.get(
  "/get-received-offers",
  authenticateCorpToken,
  getReceivedOffers
);
export default offerRouter;
