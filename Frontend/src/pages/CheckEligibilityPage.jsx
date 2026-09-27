import React, { useState } from "react";
import axios from "axios";

const CATEGORY_OPTIONS = ["Open", "OBC", "SC", "ST", "EWS"];
const COURSE_OPTIONS = ["Any", "Engineering", "Diploma", "Science", "Commerce", "Arts"];

const initialForm = {
  category: [],
  income: "",
  percentage: "",
  courseType: [],
};

const CheckEligibilityPage = () => {
  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Lets the student tick more than one option — handy if they're not sure
  // which category applies to them, or want to check more than one course.
  const toggleOption = (field, value) => {
    setFormData((prev) => {
      const current = prev[field];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: next };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.category.length === 0 || formData.courseType.length === 0) {
      setError("Please select at least one category and one course.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/check-eligibility",
        formData
      );
      setResult(response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Something went wrong.");
      } else if (err.request) {
        setError(
          "Cannot connect to backend. Make sure the Node.js server is running on port 5000."
        );
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card card-elevated p-4 bg-white mb-4">
            <h3 className="mb-4 text-center">Check Your Scholarship Eligibility</h3>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label d-block">
                    Category <span className="text-muted small">(select one or more)</span>
                  </label>
                  <div className="d-flex flex-wrap gap-3">
                    {CATEGORY_OPTIONS.map((opt) => (
                      <div className="form-check" key={opt}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`category-${opt}`}
                          checked={formData.category.includes(opt)}
                          onChange={() => toggleOption("category", opt)}
                        />
                        <label className="form-check-label" htmlFor={`category-${opt}`}>
                          {opt}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label d-block">
                    Course <span className="text-muted small">(select one or more)</span>
                  </label>
                  <div className="d-flex flex-wrap gap-3">
                    {COURSE_OPTIONS.map((opt) => (
                      <div className="form-check" key={opt}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`courseType-${opt}`}
                          checked={formData.courseType.includes(opt)}
                          onChange={() => toggleOption("courseType", opt)}
                        />
                        <label className="form-check-label" htmlFor={`courseType-${opt}`}>
                          {opt === "Any" ? "Any / Other" : opt}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="income" className="form-label">
                    Family Annual Income (₹)
                  </label>
                  <input
                    type="number"
                    id="income"
                    className="form-control"
                    placeholder="e.g. 350000"
                    value={formData.income}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="percentage" className="form-label">
                    10th / 12th / Diploma Marks (%)
                  </label>
                  <input
                    type="number"
                    id="percentage"
                    className="form-control"
                    placeholder="e.g. 78"
                    value={formData.percentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mt-4"
                disabled={loading}
              >
                {loading ? "Checking..." : "Check Eligibility"}
              </button>
            </form>

            {error && <div className="alert alert-danger mt-4 mb-0">{error}</div>}
          </div>

          {result && (
            <div className="mb-5">
              <h4 className="mb-3">
                Results — You qualify for {result.qualifiedCount} scholarship
                {result.qualifiedCount === 1 ? "" : "s"}
              </h4>

              {result.qualified.length > 0 && (
                <>
                  <h6 className="text-success mb-2">✅ Eligible</h6>
                  {result.qualified.map((s) => (
                    <div key={s.id} className="p-3 mb-2 result-card-qualified">
                      <div className="d-flex justify-content-between align-items-start">
                        <strong>{s.name}</strong>
                        <span className="badge bg-secondary">{s.provider_type}</span>
                      </div>
                      <div className="small text-muted">{s.description}</div>
                      {s.website && (
                        <a
                          href={s.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="small"
                        >
                          Visit official website ↗
                        </a>
                      )}
                    </div>
                  ))}
                </>
              )}

              {result.notQualified.length > 0 && (
                <>
                  <h6 className="text-danger mt-4 mb-2">❌ Not Eligible</h6>
                  {result.notQualified.map((s) => (
                    <div key={s.id} className="p-3 mb-2 result-card-not-qualified">
                      <div className="d-flex justify-content-between align-items-start">
                        <strong>{s.name}</strong>
                        <span className="badge bg-secondary">{s.provider_type}</span>
                      </div>
                      <ul className="small text-muted mb-0 mt-1">
                        {s.reasons.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckEligibilityPage;
