import express from "express";
import "dotenv/config";
import connectDB from "./api/database/db.js";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import morgan from "morgan";
import router from "./api/routes/routes.js";

const app = express();

app.use(express.json());
connectDB();

const allowedOrigins = [process.env.CLIENT_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: false,
  })
);

app.use(morgan("combined")); // Or 'tiny', 'dev', 'short', 'common'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests",
      message: "Calm down! Please try again in 15 minutes.",
    });
  },
});

app.use(limiter);

app.use("/api", router);

export default app;
