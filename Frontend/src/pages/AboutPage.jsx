import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || window.location.origin;

const AboutPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE}/scholarships`)
      .then((res) => setScholarships(res.data?.data || []))
      .catch(() =>
        setError(
          "Cannot connect to backend. Make sure the Node.js server is running on port 5000."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const total = scholarships.length;
  const govtCount = scholarships.filter((s) => s.provider_type === "Government").length;
  const privateCount = scholarships.filter((s) => s.provider_type === "Private").length;

  // Build a de-duplicated list of official sources from the database
  const sources = useMemo(() => {
    const seen = new Map();
    scholarships.forEach((s) => {
      if (s.website && !seen.has(s.website)) {
        seen.set(s.website, {
          website: s.website,
          name: s.name,
          provider_type: s.provider_type,
        });
      }
    });
    return Array.from(seen.values()).sort((a, b) =>
      a.website.localeCompare(b.website)
    );
  }, [scholarships]);

  return (
    <div className="container py-5">
      {/* --- HERO / MISSION SECTION --- */}
      <section className="mb-5 text-center text-md-start">
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 mb-2 rounded-pill fw-semibold">
          Bridging the Financial Gap
        </span>
        <h1 className="fw-bold display-5 mb-3">About Scholarship Eligibility Checker</h1>
        <p className="lead text-secondary col-lg-10 fs-5">
          Thousands of deserving students miss out on scholarships every year—not because 
          they aren't qualified, but because eligibility rules (income limits, academic cutoffs, 
          and reservation categories) are buried inside lengthy PDF circulars across hundreds of websites.
        </p>
        <p className="text-muted">
          Our platform consolidates complex criteria into a single, automated, rule-based matching engine so you can discover scholarships you actually qualify for in seconds.
        </p>
      </section>

      {/* --- HOW IT WORKS & PLATFORM VALUES --- */}
      <section className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="p-4 border rounded-3 bg-light h-100 shadow-sm">
            <h4 className="fw-bold text-primary mb-3">⚙️ How The Engine Works</h4>
            <ul className="list-unstyled mb-0">
              <li className="mb-3 d-flex align-items-start">
                <span className="badge bg-primary rounded-circle me-2 mt-1">1</span>
                <div>
                  <strong>Criteria Extraction:</strong> Complex eligibility parameters (academic %, family income caps, course levels, quotas) are parsed into standardized data rules.
                </div>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <span className="badge bg-primary rounded-circle me-2 mt-1">2</span>
                <div>
                  <strong>Instant Match Query:</strong> Your student profile is checked against all active schemes without storing unnecessary personal identifiers.
                </div>
              </li>
              <li className="d-flex align-items-start">
                <span className="badge bg-primary rounded-circle me-2 mt-1">3</span>
                <div>
                  <strong>Direct Verification:</strong> Unfiltered, direct access to official scheme portals to complete your application safely.
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-4 border rounded-3 bg-light h-100 shadow-sm">
            <h4 className="fw-bold text-success mb-3">🛡️ Core Commitments</h4>
            <div className="mb-3">
              <h6 className="fw-semibold mb-1">100% Free & Transparent</h6>
              <p className="text-muted small mb-0">No paywalls or hidden fees. Financial aid discovery should always remain accessible to every student.</p>
            </div>
            <div className="mb-3">
              <h6 className="fw-semibold mb-1">Zero Spam & Privacy First</h6>
              <p className="text-muted small mb-0">We never sell student profile data or require sensitive documents just to test eligibility.</p>
            </div>
            <div>
              <h6 className="fw-semibold mb-1">Verified Portal Links</h6>
              <p className="text-muted small mb-0">Every listing connects directly to legitimate government or trusted institutional application portals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- LIVE DATABASE STATS --- */}
      {!loading && !error && (
        <section className="row g-3 mb-5">
          <div className="col-md-4">
            <div className="p-3 border rounded-3 bg-white text-center shadow-sm">
              <h2 className="fw-bold text-dark mb-0">{total}</h2>
              <small className="text-muted fw-semibold">Total Scholarships Tracked</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 border rounded-3 bg-white text-center shadow-sm">
              <h2 className="fw-bold text-primary mb-0">{govtCount}</h2>
              <small className="text-muted fw-semibold">Government Schemes</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 border rounded-3 bg-white text-center shadow-sm">
              <h2 className="fw-bold text-success mb-0">{privateCount}</h2>
              <small className="text-muted fw-semibold">Private & Institutional</small>
            </div>
          </div>
        </section>
      )}

      {/* --- LOADING STATE --- */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2">Connecting to database...</p>
        </div>
      )}

      {/* --- ERROR BANNER --- */}
      {error && (
        <div className="alert alert-warning border-start border-4 border-warning shadow-sm mb-5" role="alert">
          <h5 className="fw-bold mb-1">Database Sync Warning</h5>
          <p className="mb-0">{error}</p>
        </div>
      )}

      {/* --- OFFICIAL SOURCES GRID --- */}
      {!loading && !error && (
        <section className="mt-4">
          <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-3">
            <div>
              <h4 className="fw-bold mb-1">Official Sources & Verification Links</h4>
              <p className="text-muted small mb-0">
                Cutoffs, deadlines, and guidelines update periodically. Always verify final requirements on the official portal before applying.
              </p>
            </div>
            <a
              href="https://scholarships.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-secondary mt-2 mt-md-0 text-nowrap"
            >
              National Scholarship Portal ↗
            </a>
          </div>

          {sources.length === 0 ? (
            <div className="p-4 border rounded-3 bg-light text-center text-muted">
              No official website links are currently on file in the database.
            </div>
          ) : (
            <div className="row g-3">
              {sources.map((src) => (
                <div className="col-md-6" key={src.website}>
                  <div className="p-3 border rounded-3 bg-white shadow-sm h-100 d-flex flex-row justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold text-dark mb-1">{src.name}</div>
                      <span
                        className={`badge ${
                          src.provider_type === "Government" ? "bg-primary" : "bg-success"
                        }`}
                      >
                        {src.provider_type}
                      </span>
                    </div>
                    <a
                      href={src.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary ms-2"
                    >
                      Visit Official Portal ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default AboutPage;