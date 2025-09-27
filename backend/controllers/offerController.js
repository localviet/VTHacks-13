import Offer from "../models/OfferModel.js";
const createOffer = async (req, res) => {
  const { to, desc } = req.body;
  console.log(req.user);
  const offerData = {
    to: to,
    from: req.user._id,
    desc: desc,
    status: "awaiting response",
  };
  const offer = await Offer.create(offerData);
};
const deleteOffer = async (req, res) => {
  const { to, from, accessToken } = req.body;
};

export { createOffer };
