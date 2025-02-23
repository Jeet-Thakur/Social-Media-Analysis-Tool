import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleToggle = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const endpoint = mode === "login" ? "login" : "register";
    try {
      const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        if (mode === "login") {
          localStorage.setItem("token", data.token);
          console.log("Login success!");
          alert("Login successful!");
          navigate("/dashboard");
        } else {
          console.log("User registered successfully");
          alert("Registration successful! Now switch to login.");
          setMode("login");
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(
        mode === "login" ? "Login failed:" : "Registration failed:",
        error
      );
    }
  };

  /**
   * Handle guest login
   * Calls an endpoint like 'guest' to retrieve a guest token.
   */
  const handleGuestLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (response.ok) {
        // Store the token and navigate to the dashboard
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
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left Section (Gradient, Logo, Tagline) */}
        <div
          className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white"
          style={{
            background: "linear-gradient(to right, #002B5B, #2FA4FF)",
          }}
        >
          <div className="mb-3">
            <h1 className="fw-bold">SocialConnect Illustration</h1>
          </div>
          <h3>#StayConnected</h3>
        </div>

        {/* Right Section (Form) */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="w-75 p-4 bg-white rounded shadow">
            <h2 className="text-center mb-4">
              {mode === "login" ? "Login" : "Register"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                {mode === "login" ? "Login" : "Register"}
              </button>
            </form>

            {/* Guest Login Button (visible only on login mode) */}
            {mode === "login" && (
              <div className="text-center mt-3">
                <button
                  onClick={handleGuestLogin}
                  className="btn btn-secondary w-100"
                >
                  Login as Guest
                </button>
              </div>
            )}

            <p className="mt-3 text-center">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <span
                onClick={handleToggle}
                className="text-primary"
                style={{ cursor: "pointer" }}
              >
                {mode === "login" ? "Register" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
