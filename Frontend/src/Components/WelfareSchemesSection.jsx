import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SECTOR_ICONS = {
  Health: "🩺",
  Housing: "🏠",
  Food: "🌾",
  Insurance: "🛡️",
  Pension: "👴",
  Energy: "🔥",
  "Financial Inclusion": "🏦",
  Agriculture: "🚜",
  General: "🤝",
};

const FILTERS = ["All", "Government", "Private"];

const WelfareSchemesSection = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    axios
      .get(`${API_BASE}/welfare-schemes`)
      .then((res) => setSchemes(res.data.data))
      .catch(() =>
        setError(
          "Cannot load welfare schemes. Make sure the Node.js server is running on port 5000."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "All") return schemes;
    return schemes.filter((s) => s.provider_type === filter);
  }, [schemes, filter]);

  const govtCount = schemes.filter((s) => s.provider_type === "Government").length;
  const privateCount = schemes.filter((s) => s.provider_type === "Private").length;

  return (
    <div className="mt-5 pt-4 border-top">
      <div className="text-center mb-4">
        <h2>Government &amp; Private Schemes to Ease Your Burden</h2>
        <p className="text-muted mb-0">
          Beyond scholarships, these health, housing, food, insurance and
          pension schemes help reduce everyday financial pressure on
          citizens and families.
        </p>
        <p className="text-muted small">
          Benefit amounts and eligibility rules change from time to time —
          always confirm current details on the official website before
          applying.
        </p>
      </div>

      <div className="d-flex justify-content-center gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setFilter(f)}
          >
            {f === "All" && `All (${schemes.length})`}
            {f === "Government" && `🏛️ Government (${govtCount})`}
            {f === "Private" && `🏢 Private (${privateCount})`}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-muted">Loading schemes...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        {filtered.map((s) => (
          <div className="col-md-6 col-lg-4" key={s.id}>
            <div className="card-elevated p-4 bg-white h-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="mb-0">
                  {SECTOR_ICONS[s.sector] || "🤝"} {s.name}
                </h5>
              </div>
              <div className="d-flex gap-2 mb-3">
                <span
                  className={`badge ${
                    s.provider_type === "Government" ? "bg-primary" : "bg-success"
                  }`}
                >
                  {s.provider_type}
                </span>
                <span className="badge bg-light text-dark border">{s.sector}</span>
              </div>
              <p className="text-muted small mb-2">{s.description}</p>
              <ul className="list-unstyled small text-muted mb-0">
                <li>👥 Who it's for: {s.beneficiary}</li>
                <li>💸 Benefit: {s.benefit}</li>
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

      {!loading && !error && filtered.length === 0 && (
        <p className="text-center text-muted">No schemes found for this filter.</p>
      )}
    </div>
  );
};

export default WelfareSchemesSection;
