import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CATEGORY_OPTIONS = ["All", "Open", "OBC", "SC", "ST", "EWS"];
const COURSE_OPTIONS = ["Any", "Engineering", "Diploma", "Science", "Commerce", "Arts"];

const emptyForm = {
  name: "",
  provider_type: "Government",
  category: ["All"],
  course_type: ["Any"],
  max_income: "",
  min_percentage: "",
  description: "",
  website: "",
};

const ScholarshipForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      axios
        .get(`${API_BASE}/scholarships/${id}`)
        .then((res) => setFormData(res.data.data))
        .catch(() => setError("Could not load scholarship details."))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Toggles one checkbox within a multi-select field (category or
  // course_type). Picking the wildcard ("All" / "Any") clears every other
  // option since it already covers them; picking a specific option drops
  // the wildcard. If the admin unchecks everything, we fall back to the
  // wildcard so the field is never left empty.
  const toggleOption = (field, value, wildcard) => {
    setFormData((prev) => {
      const current = prev[field];

      if (value === wildcard) {
        return { ...prev, [field]: [wildcard] };
      }

      const withoutWildcard = current.filter((v) => v !== wildcard);
      const next = withoutWildcard.includes(value)
        ? withoutWildcard.filter((v) => v !== value)
        : [...withoutWildcard, value];

      return { ...prev, [field]: next.length ? next : [wildcard] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (isEdit) {
        await axios.put(`${API_BASE}/scholarships/${id}`, formData);
      } else {
        await axios.post(`${API_BASE}/scholarships`, formData);
      }
      navigate("/admin/scholarships");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted">Loading...</p>;

  return (
    <div className="card card-elevated p-4" style={{ maxWidth: "700px" }}>
      <h4 className="mb-4">{isEdit ? "Edit Scholarship" : "Add Scholarship"}</h4>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Scholarship Name
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label htmlFor="provider_type" className="form-label">
              Provider Type
            </label>
            <select
              id="provider_type"
              className="form-select"
              value={formData.provider_type}
              onChange={handleChange}
            >
              <option value="Government">Government</option>
              <option value="Private">Private</option>
            </select>
          </div>

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
                    onChange={() => toggleOption("category", opt, "All")}
                  />
                  <label className="form-check-label" htmlFor={`category-${opt}`}>
                    {opt}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label d-block">
              Course Type <span className="text-muted small">(select one or more)</span>
            </label>
            <div className="d-flex flex-wrap gap-3">
              {COURSE_OPTIONS.map((opt) => (
                <div className="form-check" key={opt}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`course_type-${opt}`}
                    checked={formData.course_type.includes(opt)}
                    onChange={() => toggleOption("course_type", opt, "Any")}
                  />
                  <label className="form-check-label" htmlFor={`course_type-${opt}`}>
                    {opt}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="max_income" className="form-label">
              Max Income (₹)
            </label>
            <input
              type="number"
              id="max_income"
              className="form-control"
              value={formData.max_income}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label htmlFor="min_percentage" className="form-label">
              Min Marks (%)
            </label>
            <input
              type="number"
              id="min_percentage"
              className="form-control"
              value={formData.min_percentage}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            className="form-control"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="website" className="form-label">
            Official Website
          </label>
          <input
            type="url"
            id="website"
            className="form-control"
            placeholder="https://scholarships.gov.in"
            value={formData.website}
            onChange={handleChange}
          />
          <div className="form-text">
            Link to the scholarship's official page — shown to students so they can
            verify current details and apply directly.
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update Scholarship" : "Add Scholarship"}
        </button>
      </form>
    </div>
  );
};

export default ScholarshipForm;
