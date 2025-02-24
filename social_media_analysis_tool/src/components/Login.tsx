import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        console.log("Login success!");
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        console.log("Guest login success!");
        alert("Logged in as Guest!");
        navigate("/dashboard");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Guest login failed:", error);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(to bottom, #ff9966, #ff5e62)",
        backgroundSize: "cover",
      }}
    >
      <div
        className="card p-5 shadow-lg border-0"
        style={{
          width: "500px",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.6)",
          boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 className="text-center fw-bold text-dark mb-4">
          Welcome Back to AmritaSocials!
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label text-dark fw-bold">Email</label>
            <div className="input-group">
              <input
                type="email"
                className="form-control border-0"
                placeholder="Enter your email"
                style={{
                  paddingLeft: "10px",
                  fontSize: "1.2rem",
                  height: "50px",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-dark fw-bold">Password</label>
            <div className="input-group">
              <input
                type="password"
                className="form-control border-0"
                placeholder="Enter your password"
                style={{
                  paddingLeft: "10px",
                  fontSize: "1.2rem",
                  height: "50px",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-warning w-100 rounded-pill py-3"
          >
            Get Started
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            onClick={handleGuestLogin}
            className="btn btn-secondary w-100 rounded-pill py-2"
          >
            Login as Guest
          </button>
        </div>

        <p className="text-center mt-4 text-muted">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-dark fw-bold text-decoration-none"
            style={{ cursor: "pointer" }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
