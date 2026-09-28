import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import scholarshipRoutes from "./routes/scholarshipRoutes.js";
import eligibilityRoutes from "./routes/eligibilityRoutes.js";

dotenv.config();

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/", scholarshipRoutes);
app.use("/", eligibilityRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Scholarship Eligibility Checker API is running",
  });
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("=================================");
});
