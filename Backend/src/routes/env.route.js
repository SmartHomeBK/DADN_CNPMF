import { Router } from "express";
import { getEnvironmentValues } from "../controller/envValues.controller.js";
import { isUserAuthenticated } from "../middleWares/verifyToken.middleware.js";
export const route = Router();

route.get("/humid", isUserAuthenticated, getEnvironmentValues);
export const EnvRouter = route;
