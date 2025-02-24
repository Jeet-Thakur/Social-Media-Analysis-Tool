import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const SignupPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic password match validation
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Signup successful! Please log in.");
        navigate("/login");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(to bottom, #36D1DC, #5B86E5)",
        backgroundSize: "cover",
      }}
    >
      <div
        className="card p-4 shadow-lg border-0"
        style={{
          width: "450px",
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.6)",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h4 className="text-center fw-bold text-dark mb-3">
          Join AmritaSocials Today!
        </h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-dark fw-bold">Full Name</label>
            <input
              type="text"
              className="form-control border-0"
              placeholder="Enter your full name"
              style={{ fontSize: "1rem", height: "45px" }}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-dark fw-bold">Email</label>
            <input
              type="email"
              className="form-control border-0"
              placeholder="Enter your email"
              style={{ fontSize: "1rem", height: "45px" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-dark fw-bold">Password</label>
            <input
              type="password"
              className="form-control border-0"
              placeholder="Create a password"
              style={{ fontSize: "1rem", height: "45px" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-dark fw-bold">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control border-0"
              placeholder="Confirm your password"
              style={{ fontSize: "1rem", height: "45px" }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-info w-100 rounded-pill py-2"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-3 text-muted">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-dark fw-bold text-decoration-none"
            style={{ cursor: "pointer" }}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
