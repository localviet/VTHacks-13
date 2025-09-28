import CorpsOffer from "../models/CorpsOfferModel.js";
import CreatorsOffer from "../models/CreatorsOfferModel.js";
import CreatorUser from "../models/CreatorUserModel.js";
import CorpUser from "../models/CorpUserModel.js";
const createOffer = async (req, res) => {
  console.log("Creating offer...");
  const { to, desc, salary, deadline } = req.body;
  console.log(req.user);
  console.log("just printed user");
  let fromName = "";
  if (req.user.userType == "CorpUser") {
    const foundUser = await CorpUser.findById(req.user._id);
    fromName = foundUser.name;
  } else {
    const foundUser = await CreatorUser.findById(req.user._id);
    fromName = `${foundUser.firstName} ${foundUser.lastName}`;
  }
  console.log("fromName:", fromName);
  const offerData = {
    to: to,
    from: req.user._id,
    fromName: fromName,
    desc: desc,
    status: "awaiting response",
    salary: salary,
    deadline: deadline,
  };
  console.log(offerData);
  console.log();
  if (req.user.userType == "CorpUser") {
    const offer = await CorpsOffer.create(offerData);
    await CreatorUser.findByIdAndUpdate(
      to,
      { $push: { offers: offer._id } },
      { new: true }
    );
    // await CorpUser.findByIdAndUpdate(
    //   req.user._id,
    //   { $push: { offers: offer._id } },
    //   { new: true }
    // );
  } else {
    console.log("creator user detected");
    const offer = await CreatorsOffer.create(offerData);
    console.log("offer created:", offer);
    await CorpUser.findByIdAndUpdate(
      to,
      { $push: { offers: offer._id } },
      { new: true }
    );
    // await CreatorUser.findByIdAndUpdate(
    //   req.user._id,
    //   { $push: { offers: offer._id } },
    //   { new: true }
    // );
  }
  return res
    .status(201)
    .json({ message: "Offer created successfully", offerData: offerData });
};
const deleteOffer = async (req, res) => {
  console.log("deleting offer");
  const { to } = req.body;
  if (req.user.userType === "CorpUser") {
    console.log("corp user detected");
    const offer = await CorpsOffer.findOne({ to: to, from: req.user._id });
    console.log("offer found:", offer);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // remove references from both users
    const blank = await CorpUser.findByIdAndUpdate(
      req.user._id,
      { $pull: { offers: offer._id } },
      { new: true }
    );
    console.log(`$blank ${blank}`);
    await CreatorUser.findByIdAndUpdate(
      to,
      { $pull: { offers: offer._id } },
      { new: true }
    );
    console.log("all updated");

    // actually delete the offer and await the result
    const deleted = await CorpsOffer.findByIdAndDelete(offer._id);
    console.log("corpsOffer deleted:", deleted);
  } else {
    console.log("creator user detected");
    const offer = await CreatorsOffer.findOne({ to: to, from: req.user._id });
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    await CreatorUser.findByIdAndUpdate(
      req.user._id,
      { $pull: { offers: offer._id } },
      { new: true }
    );
    await CorpUser.findByIdAndUpdate(
      to,
      { $pull: { offers: offer._id } },
      { new: true }
    );

    const deleted = await CreatorsOffer.findByIdAndDelete(offer._id);
    console.log("creatorsOffer deleted:", deleted);
  }
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

const getReceivedOffers = async (req, res) => {
  console.log("Getting received offers for user:", req.user);
  if (req.user.userType === "CorpUser") {
    console.log("corp user detected");
    const foundUser = await CorpUser.findById(req.user._id);
    console.log("foundUser:", foundUser);
    if (!foundUser || !Array.isArray(foundUser.offers)) {
      return res.status(200).json({ offers: [] });
    }
    const OfferObjects = [];
    for (let i = 0; i < foundUser.offers.length; i++) {
      const id = foundUser.offers[i];
      // try both collections because you store mixed offer types in the same array
      let offer = await CreatorsOffer.findById(id);
      if (!offer) offer = await CorpsOffer.findById(id);
      if (offer) OfferObjects.push(offer);
    }
    console.log("OfferObjects:", OfferObjects);
    return res.status(200).json({ offers: OfferObjects });
  } else if (req.user.userType === "CreatorUser") {
    console.log("creator user detected");
    const foundUser = await CreatorUser.findById(req.user._id);
    console.log("foundUser:", foundUser);
    if (!foundUser || !Array.isArray(foundUser.offers)) {
      return res.status(200).json({ offers: [] });
    }
    const OfferObjects = [];
    for (let i = 0; i < foundUser.offers.length; i++) {
      const id = foundUser.offers[i];
      let offer = await CorpsOffer.findById(id);
      if (!offer) offer = await CreatorsOffer.findById(id);
      if (offer) OfferObjects.push(offer);
    }
    return res.status(200).json({ offers: OfferObjects });
  }
};
export { createOffer, deleteOffer, changeOfferStatus, getReceivedOffers };
