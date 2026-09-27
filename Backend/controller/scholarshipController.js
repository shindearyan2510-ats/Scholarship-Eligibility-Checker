import db from "../Config/db.js";
import { toStoredValue, fromStoredValue } from "../utils/arrayField.js";

// Convert a raw DB row's category/course_type (stored as a JSON-array
// string, e.g. '["SC","ST"]') into real arrays before it goes to the
// frontend. Also copes with rows saved before multi-select existed.
const formatRow = (row) => ({
  ...row,
  category: fromStoredValue(row.category),
  course_type: fromStoredValue(row.course_type),
});

// GET all scholarships (used by Admin dashboard table)
export const getScholarships = (req, res) => {
  const sql = "SELECT * FROM scholarships ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Fetch Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    }

    res.json({
      success: true,
      data: result.map(formatRow),
    });
  });
};

// GET single scholarship by id (used to pre-fill the edit form)
export const getScholarshipById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM scholarships WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error", error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }
    res.json({ success: true, data: formatRow(result[0]) });
  });
};

// POST - Add a new scholarship (Admin)
export const addScholarship = (req, res) => {
  const {
    name,
    provider_type,
    category,
    course_type,
    max_income,
    min_percentage,
    description,
    website,
  } = req.body;

  // category/course_type now arrive as arrays from the multi-select
  // checkboxes (a bare string is still accepted for backwards compatibility).
  const categories = Array.isArray(category) ? category : category ? [category] : [];
  const courseTypes = Array.isArray(course_type) ? course_type : course_type ? [course_type] : [];

  if (!name || categories.length === 0 || max_income === undefined || min_percentage === undefined) {
    return res.status(400).json({
      success: false,
      message: "name, at least one category, max_income and min_percentage are required",
    });
  }

  const sql = `
    INSERT INTO scholarships
    (name, provider_type, category, course_type, max_income, min_percentage, description, website)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      provider_type || "Government",
      toStoredValue(categories),
      toStoredValue(courseTypes.length ? courseTypes : ["Any"]),
      max_income,
      min_percentage,
      description || "",
      website || "",
    ],
    (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json({
          success: false,
          message: "Database error",
          error: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Scholarship added successfully",
        id: result.insertId,
      });
    }
  );
};

// PUT - Update an existing scholarship (Admin)
export const updateScholarship = (req, res) => {
  const { id } = req.params;
  const {
    name,
    provider_type,
    category,
    course_type,
    max_income,
    min_percentage,
    description,
    website,
  } = req.body;

  const categories = Array.isArray(category) ? category : category ? [category] : [];
  const courseTypes = Array.isArray(course_type) ? course_type : course_type ? [course_type] : [];

  const sql = `
    UPDATE scholarships
    SET name = ?, provider_type = ?, category = ?, course_type = ?, max_income = ?,
        min_percentage = ?, description = ?, website = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name,
      provider_type,
      toStoredValue(categories),
      toStoredValue(courseTypes),
      max_income,
      min_percentage,
      description,
      website,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Update Error:", err);
        return res.status(500).json({
          success: false,
          message: "Database error",
          error: err.message,
        });
      }

      res.json({
        success: true,
        message: "Scholarship updated successfully",
      });
    }
  );
};

// DELETE - Remove a scholarship (Admin)
export const deleteScholarship = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM scholarships WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Delete Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    }

    res.json({
      success: true,
      message: "Scholarship deleted successfully",
    });
  });
};
