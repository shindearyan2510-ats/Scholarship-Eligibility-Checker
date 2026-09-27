import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const FILTERS = ["All", "Government", "Private"];

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    axios
      .get("http://localhost:5000/scholarships")
      .then((res) => setScholarships(res.data.data))
      .catch(() =>
        setError(
          "Cannot connect to backend. Make sure the Node.js server is running on port 5000."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "All") return scholarships;
    return scholarships.filter((s) => s.provider_type === filter);
  }, [scholarships, filter]);

  const govtCount = scholarships.filter((s) => s.provider_type === "Government").length;
  const privateCount = scholarships.filter((s) => s.provider_type === "Private").length;
  const [view, setView] = useState("cards"); // "cards" | "table"

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2>Government & Private Scholarships</h2>
        <p className="text-muted">
          Browse every scholarship currently listed. Not sure which ones you
          qualify for?{" "}
          <Link to="/check-eligibility">Check your eligibility here</Link>.
        </p>
      </div>

      <div className="d-flex justify-content-center gap-2 mb-3">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setFilter(f)}
          >
            {f === "All" && `All (${scholarships.length})`}
            {f === "Government" && `🏛️ Government (${govtCount})`}
            {f === "Private" && `🏢 Private (${privateCount})`}
          </button>
        ))}
      </div>

      <div className="d-flex justify-content-center gap-2 mb-4">
        <div className="btn-group btn-group-sm" role="group">
          <button
            className={`btn ${view === "cards" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setView("cards")}
          >
            🗂️ Card View
          </button>
          <button
            className={`btn ${view === "table" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setView("table")}
          >
            📋 Table View
          </button>
        </div>
      </div>

      {loading && <p className="text-center text-muted">Loading scholarships...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {view === "cards" && (
        <div className="row g-4">
          {filtered.map((s) => (
            <div className="col-md-6 col-lg-4" key={s.id}>
              <div className="card-elevated p-4 bg-white h-100">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="mb-0">{s.name}</h5>
                  <span
                    className={`badge ${
                      s.provider_type === "Government" ? "bg-primary" : "bg-success"
                    }`}
                  >
                    {s.provider_type}
                  </span>
                </div>
                <div className="mb-3">
                  {(s.category || []).map((c) => (
                    <span key={c} className="badge bg-light text-dark border me-1">
                      {c}
                    </span>
                  ))}
                </div>
                <p className="text-muted small mb-3">{s.description}</p>
                <ul className="list-unstyled small text-muted mb-0">
                  <li>💰 Max Income: ₹{Number(s.max_income).toLocaleString("en-IN")}</li>
                  <li>📊 Min Marks: {s.min_percentage}%</li>
                  <li>🎓 Course: {(s.course_type || []).join(", ")}</li>
                </ul>
                {s.website && (
                  <a
                    href={s.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary mt-3"
                  >
                    Visit Official Website ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "table" && !loading && !error && (
        <div className="table-responsive card-elevated bg-white p-2">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Course</th>
                <th>Max Income</th>
                <th>Min %</th>
                <th>Official Website</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td className="fw-semibold">{s.name}</td>
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
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-center text-muted">No scholarships found for this filter.</p>
      )}
    </div>
  );
};

export default ScholarshipsPage;
