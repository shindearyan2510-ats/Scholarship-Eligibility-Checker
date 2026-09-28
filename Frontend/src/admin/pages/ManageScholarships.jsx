import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || window.location.origin;

const ManageScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadScholarships = () => {
    setLoading(true);
    axios
      .get(`${API_BASE}/scholarships`)
      .then((res) => setScholarships(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadScholarships();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this scholarship?")) return;

    try {
      await axios.delete(`${API_BASE}/scholarships/${id}`);
      loadScholarships();
    } catch (err) {
      alert("Failed to delete scholarship.");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Manage Scholarships</h4>
        <Link to="/admin/scholarships/add" className="btn btn-primary">
          + Add Scholarship
        </Link>
      </div>

      <div className="card card-elevated p-3">
        {loading ? (
          <p className="text-muted mb-0">Loading...</p>
        ) : scholarships.length === 0 ? (
          <p className="text-muted mb-0">No scholarships added yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Course</th>
                  <th>Max Income</th>
                  <th>Min %</th>
                  <th>Website</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scholarships.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>
                      <span
                        className={`badge ${
                          s.provider_type === "Government" ? "bg-primary" : "bg-success"
                        }`}
                      >
                        {s.provider_type}
                      </span>
                    </td>
                    <td>{(s.category || []).join(", ")}</td>
                    <td>{(s.course_type || []).join(", ")}</td>
                    <td>₹{Number(s.max_income).toLocaleString("en-IN")}</td>
                    <td>{s.min_percentage}%</td>
                    <td>
                      {s.website ? (
                        <a href={s.website} target="_blank" rel="noopener noreferrer">
                          Visit ↗
                        </a>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/admin/scholarships/edit/${s.id}`}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(s.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageScholarships;
