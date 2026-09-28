import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE}/scholarships`)
      .then((res) => setScholarships(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(scholarships.flatMap((s) => s.category || []))];
  const govtCount = scholarships.filter((s) => s.provider_type === "Government").length;
  const privateCount = scholarships.filter((s) => s.provider_type === "Private").length;

  return (
    <div>
      <h4 className="mb-4">Dashboard</h4>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="stat-box" style={{ backgroundColor: "#1d5fbf" }}>
            <div className="small">Total Scholarships</div>
            <div className="display-6">{loading ? "…" : scholarships.length}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-box" style={{ backgroundColor: "#123f85" }}>
            <div className="small">Government</div>
            <div className="display-6">{loading ? "…" : govtCount}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-box" style={{ backgroundColor: "#2e9e5b" }}>
            <div className="small">Private</div>
            <div className="display-6">{loading ? "…" : privateCount}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-box" style={{ backgroundColor: "#c9862a" }}>
            <div className="small">Quick Action</div>
            <Link to="/admin/scholarships/add" className="btn btn-light btn-sm mt-2">
              + Add Scholarship
            </Link>
          </div>
        </div>
      </div>

      <div className="card card-elevated p-3">
        <h6 className="mb-3">Recently Added</h6>
        {loading ? (
          <p className="text-muted mb-0">Loading...</p>
        ) : (
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Max Income</th>
                <th>Min %</th>
              </tr>
            </thead>
            <tbody>
              {scholarships.slice(0, 5).map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.provider_type}</td>
                  <td>{(s.category || []).join(", ")}</td>
                  <td>₹{Number(s.max_income).toLocaleString("en-IN")}</td>
                  <td>{s.min_percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
