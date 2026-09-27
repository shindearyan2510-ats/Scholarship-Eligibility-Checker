import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar p-3">
      <h5 className="text-white mb-4">🎓 Admin Panel</h5>
      <NavLink to="/admin" end className={({ isActive }) => (isActive ? "active" : "")}>
        Dashboard
      </NavLink>
      <NavLink
        to="/admin/scholarships"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Manage Scholarships
      </NavLink>
      <NavLink to="/" className="mt-4">
        ⬅ Back to Website
      </NavLink>
    </div>
  );
};

export default Sidebar;
