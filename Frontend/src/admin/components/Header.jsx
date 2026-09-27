import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // NOTE: auth.js was removed, so there is no session state left to clear here.
    navigate("/login");
  };

  return (
    <div className="d-flex justify-content-between align-items-center bg-white p-3 shadow-sm mb-4">
      <h5 className="mb-0">Scholarship Eligibility Checker — Admin</h5>
      <div className="d-flex align-items-center gap-3">
        <span className="text-muted">Welcome, aryan</span>
        <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
