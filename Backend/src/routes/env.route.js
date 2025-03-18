import { Router } from "express";
import { getEnvironmentValues } from "../controller/envValues.controller.js";
export const route = Router();

route.get("/humid", getEnvironmentValues);
export const EnvRouter = route;
