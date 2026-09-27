import express from "express";
import cors from "cors";

import scholarshipRoutes from "./routes/scholarshipRoutes.js";
import eligibilityRoutes from "./routes/eligibilityRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", scholarshipRoutes);
app.use("/", eligibilityRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Scholarship Eligibility Checker API is running",
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("=================================");
});
