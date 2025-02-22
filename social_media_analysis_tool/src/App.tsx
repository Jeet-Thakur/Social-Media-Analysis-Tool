// import ListGroup from "./components/ListGroup";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute component={<Dashboard />} />}
        />
      </Routes>
    </Router>
  );
};

// Protects the dashboard so only logged-in users can access it
const ProtectedRoute = ({ component }: { component: React.ReactElement }) => {
  const token = localStorage.getItem("token");
  return token ? component : <Navigate to="/" />;
};

export default App;
