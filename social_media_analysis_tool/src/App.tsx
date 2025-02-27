import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import SignupPage from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile"; // new import

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route shows Dashboard (adjust if needed) */}
        <Route path="/" element={<Dashboard />} />
        {/* Login route */}
        <Route path="/login" element={<Login />} />
        {/* Signup route */}
        <Route path="/signup" element={<SignupPage />} />
        {/* Protected dashboard route */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute component={<Dashboard />} />}
        />
        {/* Protected profile route */}
        <Route
          path="/profile"
          element={<ProtectedRoute component={<Profile />} />}
        />
      </Routes>
    </Router>
  );
};

// Protects the dashboard and profile so only logged-in users can access them
const ProtectedRoute = ({ component }: { component: React.ReactElement }) => {
  const token = localStorage.getItem("token");
  return token ? component : <Navigate to="/login" />;
};

export default App;
