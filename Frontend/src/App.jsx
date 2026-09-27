import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Website Layout
import WebsiteLayout from "./WebsiteLayout";

// Admin Layout
import AdminLayout from "./admin/components/AdminLayout";

// Website Pages
import HomePage from "./pages/HomePage";
import ScholarshipsPage from "./pages/ScholarshipsPage";
import CheckEligibilityPage from "./pages/CheckEligibilityPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";

// Admin Pages
import Dashboard from "./admin/pages/Dashboard";
import ManageScholarships from "./admin/pages/ManageScholarships";
import ScholarshipForm from "./admin/pages/ScholarshipForm";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public student-facing site */}
        <Route element={<WebsiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/check-eligibility" element={<CheckEligibilityPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Admin panel */}
        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          <Route index element={<Dashboard />} />
          <Route path="scholarships" element={<ManageScholarships />} />
          <Route path="scholarships/add" element={<ScholarshipForm />} />
          <Route path="scholarships/edit/:id" element={<ScholarshipForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
