import {
  createOffer,
  deleteOffer,
  changeOfferStatus,
  getReceivedOffers,
  // createCreatorsOffer,
} from "../controllers/offerController.js";
import { Router } from "express";
import {
  authenticateCorpToken,
  //authenticateCreatorToken,
} from "../controllers/userAccountController.js";
const offerRouter = Router();

offerRouter.post("/create-offer", authenticateCorpToken, createOffer);
offerRouter.delete("/delete-corps-offer", authenticateCorpToken, deleteOffer);
offerRouter.delete(
  "/delete-creators-offer",
  //authenticateCreatorToken,
  authenticateCorpToken,
  deleteOffer
);
offerRouter.get(
  "/get-received-offers",
  authenticateCorpToken,
  getReceivedOffers
);
export default offerRouter;
