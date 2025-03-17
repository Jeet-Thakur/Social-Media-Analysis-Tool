import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import IntroBoard from "./components/IntroBoard"; // New intro component
import Login from "./components/Login";
import SignupPage from "./components/Signup";
import Dashboard from "./components/Dashboard";

import Analysis from "./components/analysis"; // Ensure this path is correct
import DataDisplay from "./components/datadisplay";
import Colab from "./components/collab"; // Import the new Colab component
import Trend from "./components/trend"; // Import the Trend component


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route shows IntroBoard */}
        <Route path="/" element={<IntroBoard />} />
        {/* Login route */}
        <Route path="/login" element={<Login />} />
        {/* Signup route */}
        <Route path="/signup" element={<SignupPage />} />
        {/* Protected dashboard route */}

        <Route path="/dashboard" element={<ProtectedRoute component={<Dashboard />} />} />
        {/* Analysis route */}
        <Route path="/analysis" element={<ProtectedRoute component={<Analysis />} />} />
        {/* Data Display route */}
        <Route path="/datadisplay" element={<ProtectedRoute component={<DataDisplay />} />} />
        {/* Colab route */}
        <Route path="/colab" element={<ProtectedRoute component={<Colab />} />} />
        {/* Trend route */}
        <Route path="/trend" element={<ProtectedRoute component={<Trend />} />} />

      </Routes>
    </Router>
  );
};


// Protects routes so only logged-in users can access them

const ProtectedRoute = ({ component }: { component: React.ReactElement }) => {
  const token = localStorage.getItem("token");
  return token ? component : <Navigate to="/login" />;
};

export default App;