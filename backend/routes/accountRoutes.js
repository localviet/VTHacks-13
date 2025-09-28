import express from "express";
import {
  login,
  refresh,
  creatorUserRegister,
  getAllCreators,
  corpUserRegister,
  getAllUsers,
  getUserById,
} from "../controllers/userAccountController.js";
const apiRouter = express.Router();

//apiRouter.use("/register", userRegister);

apiRouter.get("/login", login);
apiRouter.post("/register/creator", creatorUserRegister);
apiRouter.post("/register/corp", corpUserRegister);
apiRouter.get("/refresh", refresh);
apiRouter.get("/users", getAllUsers);
apiRouter.get("/creators", getAllCreators);
apiRouter.get("/users/:id", getUserById);
export default apiRouter;
