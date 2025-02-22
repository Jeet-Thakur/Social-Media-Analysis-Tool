import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Welcome to Your Dashboard</h2>
      <p className="text-center">
        This is a dummy dashboard. You are logged in!
      </p>
      <div className="d-flex justify-content-center">
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
