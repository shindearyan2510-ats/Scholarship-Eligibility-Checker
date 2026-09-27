import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayout = () => {
  return (
    <div className="d-flex">
      <div style={{ width: "240px" }}>
        <Sidebar />
      </div>
      <div className="flex-grow-1">
        <Header />
        <div className="px-4 pb-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
