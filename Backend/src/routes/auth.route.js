import { Router } from "express";
import {
  checkAuth,
  login,
  logOut,
  SignUp,
} from "../controller/auth.controller.js";
import { isUserAuthenticatedByBearer } from "../middleWares/verifyTokenByBearer.middleware.js";

const route = Router();

route.post("/login", login);
route.post("/signup", SignUp);
route.get("/logout", logOut);
route.get("/check-auth", isUserAuthenticatedByBearer, checkAuth);
export const AuthRouter = route;
