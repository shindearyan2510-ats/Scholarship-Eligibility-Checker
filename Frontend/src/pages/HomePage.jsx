import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const HomePage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE}/scholarships`)
      .then((res) => setScholarships(res.data.data))
      .catch(() => setScholarships([]))
      .finally(() => setLoading(false));
  }, []);

  const total = scholarships.length;
  const govtCount = scholarships.filter((s) => s.provider_type === "Government").length;
  const privateCount = scholarships.filter((s) => s.provider_type === "Private").length;

  return (
    <>
      <section className="hero text-center">
        <div className="container">
          <h1 className="display-5">Scholarship Eligibility Checker</h1>
          <p className="lead mb-4">
            Stop digging through scattered PDFs and circulars. Enter your details once
            and instantly see every scholarship you qualify for — and why you don't
            qualify for the rest.
          </p>
          <p className="mb-4">
            {loading
              ? "Loading live scholarship data…"
              : `Currently tracking ${total} scholarship${total === 1 ? "" : "s"} — ${govtCount} Government and ${privateCount} Private.`}
          </p>
          <Link to="/check-eligibility" className="btn btn-light btn-lg fw-semibold me-2">
            Check My Eligibility
          </Link>
          <Link to="/scholarships" className="btn btn-outline-light btn-lg fw-semibold">
            View All Scholarships
          </Link>
        </div>
      </section>

      <section className="container py-5">
        <div className="row text-center g-4">
          <div className="col-md-3">
            <div className="p-4 card-elevated h-100 bg-white">
              <h4>{loading ? "…" : total}</h4>
              <p className="text-muted mb-0">Scholarships listed</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-4 card-elevated h-100 bg-white">
              <h4>{loading ? "…" : govtCount}</h4>
              <p className="text-muted mb-0">🏛️ Government</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-4 card-elevated h-100 bg-white">
              <h4>{loading ? "…" : privateCount}</h4>
              <p className="text-muted mb-0">🏢 Private</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-4 card-elevated h-100 bg-white">
              <h4>⚙️</h4>
              <p className="text-muted mb-0">Rule-based matching</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-5">
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="p-4 card-elevated h-100 bg-white">
              <h4>📝 One Simple Form</h4>
              <p className="text-muted mb-0">
                Enter your category, family income, marks % and course —
                that's all it takes.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 card-elevated h-100 bg-white">
              <h4>⚙️ Rule Engine</h4>
              <p className="text-muted mb-0">
                Your details are automatically checked against every scholarship's
                eligibility criteria stored in the database.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 card-elevated h-100 bg-white">
              <h4>📊 Clear Results</h4>
              <p className="text-muted mb-0">
                See scholarships you qualify for, plus the exact reason you don't
                qualify for the others.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
