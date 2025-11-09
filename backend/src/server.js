import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import showcaseRoutes from "./routes/showcaseRoutes.js";

import voteRoutes from "./routes/voteRoutes.js";

const app = express();


app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const FRONTEND = process.env.FRONTEND_URL || "http://localhost:8081";
app.use(cors({ origin: FRONTEND }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/showcase", showcaseRoutes);







app.get("/", (req, res) =>
  res.json({ ok: true, message: "Showcase backend running" })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Showcase backend running on port ${PORT}`)
);
