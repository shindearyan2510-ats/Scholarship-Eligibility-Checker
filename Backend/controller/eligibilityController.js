import db from "../Config/db.js";

// POST /check-eligibility
// Takes the student's details and checks them against every scholarship
// stored in the database, returning which ones they qualify for and why
// they don't qualify for the rest.
export const checkEligibility = (req, res) => {
  const { category, income, percentage, courseType } = req.body;

  if (
    !category ||
    income === undefined ||
    percentage === undefined ||
    !courseType
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

    scholarships.forEach((s) => {
      const reasons = [];

      // Rule 1: Category must match (unless scholarship is open to "All")
      if (s.category !== "All" && s.category !== category) {
        reasons.push(`Category "${category}" does not match required category "${s.category}"`);
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

      // Rule 4: Course type must match (unless scholarship applies to "Any" course)
      if (s.course_type !== "Any" && s.course_type !== courseType) {
        reasons.push(`Course type "${courseType}" does not match required course "${s.course_type}"`);
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
