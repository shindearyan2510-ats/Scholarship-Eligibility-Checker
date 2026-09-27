import express from "express";

import { checkEligibility } from "../controller/eligibilityController.js";

const router = express.Router();

// POST - Check a student's eligibility against all scholarships
router.post("/check-eligibility", checkEligibility);

export default router;
