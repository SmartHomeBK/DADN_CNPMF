import express from "express";
import dotenv from "dotenv";
import root from "./routes/root.route.js";
import cors from "cors";
import { dbConnect } from "./dbConnect/db.js";

import cookieParser from "cookie-parser";
import { errorMiddleWare } from "./middleWares/errorMiddleware.middleware.js";
dotenv.config();
console.log("Current working directory:", process.cwd());
console.log("PORT:", process.env.PORT);
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://app.ohstem.vn/",
      "http://localhost:5174",
    ],
    method: ["POST", "PUT", "DELETE", "GET"],
    credentials: true, //allow cookie be sent with request.
  })
);

app.use(root);

app.use(errorMiddleWare);
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on the PORT ${process.env.PORT}`);
  dbConnect();
});
