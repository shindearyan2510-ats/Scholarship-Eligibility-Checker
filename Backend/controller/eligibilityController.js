import db from "../Config/db.js";
import { fromStoredValue, overlapsOrWildcard } from "../utils/arrayField.js";

// POST /check-eligibility
// Takes the student's details and checks them against every scholarship
// stored in the database, returning which ones they qualify for and why
// they don't qualify for the rest.
//
// category and courseType now arrive as arrays (the student can tick more
// than one, e.g. if they're unsure which category applies) — a scholarship
// counts as a category/course match if there's any overlap between what the
// student picked and the scholarship's own (also multi-select) list.
export const checkEligibility = (req, res) => {
  const { category, income, percentage, courseType } = req.body;

  const categories = Array.isArray(category) ? category : category ? [category] : [];
  const courseTypes = Array.isArray(courseType) ? courseType : courseType ? [courseType] : [];

  if (
    categories.length === 0 ||
    income === undefined ||
    percentage === undefined ||
    courseTypes.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "category, income, percentage and courseType are all required",
    });
  }

  const studentIncome = Number(income);
  const studentPercentage = Number(percentage);

  const sql = "SELECT * FROM scholarships";

  db.query(sql, (err, scholarships) => {
    if (err) {
      console.error("Eligibility Check Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    }

    const qualified = [];
    const notQualified = [];

    scholarships.forEach((row) => {
      const reasons = [];
      const allowedCategories = fromStoredValue(row.category);
      const allowedCourses = fromStoredValue(row.course_type);
      const s = { ...row, category: allowedCategories, course_type: allowedCourses };

      // Rule 1: at least one selected category must match (unless the
      // scholarship is open to "All")
      if (!overlapsOrWildcard(allowedCategories, categories, "All")) {
        reasons.push(
          `Your selected category (${categories.join(", ")}) does not match the required category (${allowedCategories.join(", ")})`
        );
      }

      // Rule 2: Family income must be within the limit
      if (studentIncome > s.max_income) {
        const diff = studentIncome - s.max_income;
        reasons.push(`Income exceeds limit by ₹${diff.toLocaleString("en-IN")}`);
      }

      // Rule 3: Marks % must meet the minimum
      if (studentPercentage < s.min_percentage) {
        reasons.push(`Marks are ${s.min_percentage - studentPercentage}% below the required ${s.min_percentage}%`);
      }

      // Rule 4: at least one selected course type must match (unless the
      // scholarship applies to "Any" course)
      if (!overlapsOrWildcard(allowedCourses, courseTypes, "Any")) {
        reasons.push(
          `Your selected course (${courseTypes.join(", ")}) does not match the required course (${allowedCourses.join(", ")})`
        );
      }

      if (reasons.length === 0) {
        qualified.push(s);
      } else {
        notQualified.push({ ...s, reasons });
      }
    });

    res.json({
      success: true,
      qualifiedCount: qualified.length,
      qualified,
      notQualified,
    });
  });
};
