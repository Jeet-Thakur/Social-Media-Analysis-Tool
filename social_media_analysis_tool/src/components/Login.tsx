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
          navigate("/dashboard"); // Redirect to Dashboard
        } else {
          console.log("User registered successfully");
          alert("Registration successful! Now switch to login.");
          setMode("login"); // Switch to login after successful registration
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(mode === "login" ? "Login failed:" : "Registration failed:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-lg w-25">
        <h2 className="text-center mb-4">{mode === "login" ? "Login" : "Register"}</h2>

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

        <p className="mt-3 text-center">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={handleToggle} className="text-primary" style={{ cursor: "pointer", textDecoration: "underline" }}>
            {mode === "login" ? "Register" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
