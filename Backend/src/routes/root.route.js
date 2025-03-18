import { Router } from "express";
import { EnvRouter } from "./env.route.js";
import { AuthRouter } from "./auth.route.js";

const root = Router();

root.use("/api/env", EnvRouter);
root.use("/api/auth", AuthRouter);
export default root;
