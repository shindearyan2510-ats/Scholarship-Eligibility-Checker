import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // ONLY these credentials can access the admin panel
    if (username === "aryan" && password === "aryan123") {
      // Save authentication status
      sessionStorage.setItem("adminAuthenticated", "true");

      // Open admin panel
      navigate("/admin", { replace: true });
    } else {
      // Wrong credentials
      sessionStorage.removeItem("adminAuthenticated");

      setError("Invalid username or password.");
      setPassword("");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card card-elevated p-4 bg-white">

            <h3 className="text-center mb-4">
              Admin Login
            </h3>

            <form onSubmit={handleSubmit}>

              {/* Username */}
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>

                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <div className="alert alert-danger py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Login
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
