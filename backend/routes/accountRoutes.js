import express from "express";
import {
  login,
  refresh,
  creatorUserRegister,
  corpUserRegister,
<<<<<<< HEAD
  solveJWT,
=======
  getAllUsers,
  getUserById,
>>>>>>> 1c011eab406a37158567aa96797d92a22c90dcd3
} from "../controllers/userAccountController.js";
const apiRouter = express.Router();

//apiRouter.use("/register", userRegister);

apiRouter.get("/login", login);
apiRouter.post("/register/creator", creatorUserRegister);
apiRouter.post("/register/corp", corpUserRegister);
apiRouter.get("/refresh", refresh);
<<<<<<< HEAD
apiRouter.get("/solveJWT", solveJWT);
=======
apiRouter.get("/users", getAllUsers);
apiRouter.get("/users/:id", getUserById);
>>>>>>> 1c011eab406a37158567aa96797d92a22c90dcd3
export default apiRouter;
