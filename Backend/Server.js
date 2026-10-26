import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import scholarshipRoutes from "./routes/scholarshipRoutes.js";
import eligibilityRoutes from "./routes/eligibilityRoutes.js";
import { databaseReady, initializeDatabase } from "./Config/db.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
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

app.use(["/scholarships", "/check-eligibility"], (req, res, next) => {
  if (databaseReady) {
    return next();
  }

  return res.status(503).json({
    success: false,
    message: "Database is unavailable. Check the MySQL environment variables and connection settings.",
  });
});

app.use("/", scholarshipRoutes);
app.use("/", eligibilityRoutes);

app.get("/api/health", (req, res) => {
  res.status(databaseReady ? 200 : 503).json({
    success: databaseReady,
    status: databaseReady ? "ready" : "database-unavailable",
    message: databaseReady
      ? "Scholarship Eligibility Checker API and database are ready"
      : "API is running, but the database connection is unavailable",
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

initializeDatabase().catch((error) => {
  console.error(
    "Database unavailable; API is running without database features:",
    error.code || error.message
  );
});
