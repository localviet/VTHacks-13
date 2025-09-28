import express from "express";
import {
  login,
  refresh,
  creatorUserRegister,
  corpUserRegister,
  solveJWT,
  getAllUsers,
  getUserById,
} from "../controllers/userAccountController.js";
const apiRouter = express.Router();

//apiRouter.use("/register", userRegister);

apiRouter.get("/login", login);
apiRouter.post("/register/creator", creatorUserRegister);
apiRouter.post("/register/corp", corpUserRegister);
apiRouter.get("/refresh", refresh);
apiRouter.get("/solveJWT", solveJWT);
apiRouter.get("/users", getAllUsers);
apiRouter.get("/users/:id", getUserById);
export default apiRouter;
