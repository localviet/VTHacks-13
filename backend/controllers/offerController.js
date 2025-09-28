import CorpsOffer from "../models/CorpsOfferModel.js";
import CreatorUser from "../models/CreatorUserModel.js";
import CorpUser from "../models/CorpUserModel.js";
const createCorpsOffer = async (req, res) => {
  console.log("Creating offer...");
  const { to, desc } = req.body;
  console.log(req.user);
  console.log("just printed user");
  const offerData = {
    to: to,
    from: req.user._id,
    desc: desc,
    status: "awaiting response",
  };
  console.log(offerData);
  console.log();
  const offer = await CorpsOffer.create(offerData);
  await CreatorUser.findByIdAndUpdate(
    to,
    { $push: { offers: offer._id } },
    { new: true }
  );
  await CorpUser.findByIdAndUpdate(
    req.user._id,
    { $push: { offers: offer._id } },
    { new: true }
  );
  return res
    .status(201)
    .json({ message: "Offer created successfully", offer: offer });
};
const deleteOffer = async (req, res) => {
  const { to, from } = req.body;
  if (from !== req.user._id) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  CorpsOffer.findOneAndDelete({ to: to, from: from });
  const offer = await CorpsOffer.findOne({ to: to, from: from });
  await CorpUser.findByIdAndUpdate(
    from,
    { $pull: { offers: offer._id } },
    { new: true }
  );
  await CreatorUser.findByIdAndUpdate(
    to,
    { $pull: { offers: offer._id } },
    { new: true }
  );
  return res.status(200).json({ message: "Offer deleted successfully" });
};
const changeOfferStatus = async (req, res) => {
  const { to, from, status } = req.body;
  const offer = await CorpsOffer.findOne({ to: to, from: from });
  if (!offer) {
    return res.status(404).json({ message: "Offer not found" });
  }
  offer.status = status;
  await offer.save();
  return res
    .status(200)
    .json({ message: "Offer status updated", offer: offer });
};
export { createCorpsOffer, deleteOffer, changeOfferStatus };
