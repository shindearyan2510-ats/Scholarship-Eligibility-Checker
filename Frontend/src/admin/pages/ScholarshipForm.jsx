import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const emptyForm = {
  name: "",
  provider_type: "Government",
  category: "All",
  course_type: "Any",
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
        .get(`http://localhost:5000/scholarships/${id}`)
        .then((res) => setFormData(res.data.data))
        .catch(() => setError("Could not load scholarship details."))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/scholarships/${id}`, formData);
      } else {
        await axios.post("http://localhost:5000/scholarships", formData);
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
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="All">All</option>
              <option value="Open">Open</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label htmlFor="course_type" className="form-label">
              Course Type
            </label>
            <select
              id="course_type"
              className="form-select"
              value={formData.course_type}
              onChange={handleChange}
            >
              <option value="Any">Any</option>
              <option value="Engineering">Engineering</option>
              <option value="Diploma">Diploma</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts</option>
            </select>
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
