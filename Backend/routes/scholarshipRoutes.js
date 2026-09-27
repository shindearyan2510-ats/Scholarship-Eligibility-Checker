import express from "express";

import {
  getScholarships,
  getScholarshipById,
  addScholarship,
  updateScholarship,
  deleteScholarship,
} from "../controller/scholarshipController.js";

const router = express.Router();

// GET - Get all scholarships
router.get("/scholarships", getScholarships);

// GET - Get single scholarship
router.get("/scholarships/:id", getScholarshipById);

// POST - Add a new scholarship
router.post("/scholarships", addScholarship);

// PUT - Update a scholarship
router.put("/scholarships/:id", updateScholarship);

// DELETE - Remove a scholarship
router.delete("/scholarships/:id", deleteScholarship);

export default router;
