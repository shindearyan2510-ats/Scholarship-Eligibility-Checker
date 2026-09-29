import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import scholarshipRoutes from "./routes/scholarshipRoutes.js";
import eligibilityRoutes from "./routes/eligibilityRoutes.js";
import { initializeDatabase } from "./Config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const distPath = path.resolve(__dirname, "../Frontend/dist");
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

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Scholarship Eligibility Checker API is running",
  });
});

app.get("/", (req, res) => {
  if (fs.existsSync(distPath) && req.accepts("html")) {
    return res.sendFile(path.join(distPath, "index.html"));
  }

  return res.json({
    success: true,
    message: "Scholarship Eligibility Checker API is running",
  });
});

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

const PORT = Number(process.env.PORT) || 5000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log("=================================");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 http://localhost:${PORT}`);
      console.log("=================================");
    });
  })
  .catch((error) => {
    console.error("❌ Backend startup failed:", error.message);
    process.exitCode = 1;
  });
