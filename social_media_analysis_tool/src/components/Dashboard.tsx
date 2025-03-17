import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Card, Row, Col, Table } from "react-bootstrap";
import { Bar, Pie, Line } from 'react-chartjs-2';
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const userName = ""; // Set this to the actual username if available
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTopCreators, setShowTopCreators] = useState(false);

  // Sample dataset for top creators
  const topCreatorsData = [
    { id: 1, name: "MrBeast", subscribers: "368M" },
    { id: 2, name: "PewDiePie", subscribers: "110M" },
    { id: 3, name: "T-Series", subscribers: "287M" },
    { id: 4, name: "SET India", subscribers: "182M" },
    { id: 5, name: "Zee Music Company", subscribers: "115M" },
  ];

  // Function to handle navigation to Filter page
  const handleFilterClick = () => {
    navigate("/filter"); // Change this to the desired route
  };
  
  const handleTrendClick = () => {
    navigate('/trend'); // Navigate to the Trend page
  };

  // Function to handle navigation to Analysis page
  const handleAnalysisClick = () => {
    navigate("/analysis"); // Change this to the analysis route
  };

  // Function to handle Top List click
  const handleTopListClick = () => {
    setShowTopCreators(!showTopCreators);
  };

  // Sample data for charts
  const sampleData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    values: [65, 59, 80, 81, 56, 55, 40],
  };

  const barData = {
    labels: sampleData.labels,
    datasets: [
      {
        label: 'Bar Chart Data',
        data: sampleData.values,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [{
      data: [300, 50, 100],
      backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
      borderWidth: 1,
    }],
  };

  const lineData = {
    labels: sampleData.labels,
    datasets: [
      {
        label: 'Line Chart Data',
        data: sampleData.values,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  let userProfilePicture = "";
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      userProfilePicture = decoded.profile_picture || "";
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  return (

    <div style={{ display: "flex", height: "100vh", overflowX: "hidden" }}>
      {/* Sidebar */}

      <div
        style={{
          width: "250px",
          backgroundColor: "#2DAA9E",
          color: "white",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          flexShrink: 0,
        }}
      >
        {/* Logo & Welcome Message */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <img
            src="https://via.placeholder.com/60"
            alt="Logo"
            style={{ height: "50px", marginRight: "15px" }}
          />
          <span style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
            {userName}
          </span>
        </div>


        {/* Sidebar Links */}
        {["Home", "My Profile", "Settings", "Top List"].map((text, index) => (
          <a
            key={index}
            href="#"
            style={{
              color: "white",
              textDecoration: "none",
              margin: "10px 0",
              fontSize: "1.2rem",
              padding: "10px 15px",
              borderRadius: "8px",
              transition: "0.3s ease-in-out",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#66D2CE")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            onClick={text === "Top List" ? handleTopListClick : undefined}
          >
            {text}
          </a>
        ))}

        {/* Analytics Dropdown */}
        <div
          style={{ position: "relative", margin: "10px 0" }}
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <a
            href="#"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "1.2rem",
              padding: "10px 15px",
              borderRadius: "8px",
              transition: "0.3s ease-in-out",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#66D2CE")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            Analytics
          </a>

          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                backgroundColor: "#EAEAEA",
                borderRadius: "12px",
                padding: "10px",
                minWidth: "180px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
              }}
            >
              {["Sentiment Analysis", "Filter", "Trend", "Analysis"].map((item, idx) => (

                <div
                  key={idx}
                  style={{
                    padding: "10px 15px",
                    fontSize: "1.2rem",
                    color: "#333",
                    cursor: "pointer",
                    borderRadius: "10px",
                    transition: "0.3s ease-in-out",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#E3D2C3")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  onClick={item === "Analysis" ? handleAnalysisClick : item === "Trend" ? handleTrendClick : handleFilterClick}
                >

                  {item}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", backgroundColor: "#F8FAFC", overflowY: "auto" }}>
        {/* Cards Section */}
        <Row className="mb-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Col xs={12} sm={6} md={3} key={index} className="mb-4">
              <Card
                style={{
                  width: "100%",
                  transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                  margin: "10px",
                  backgroundColor: "#FFEEAD",
                  color: "black",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Card.Body>
                  {index === 0 ? (
                    <div style={{ fontSize: "3rem", color: "black", textAlign: "center" }}>
                      53K <span style={{ fontSize: "1rem", color: "black" }}>views</span>

                    </div>
                  ) : index === 1 ? (
                    <div style={{ fontSize: "3rem", color: "black", textAlign: "center" }}>
                      27% <span style={{ fontSize: "1rem", color: "black" }}>Population</span>
                    </div>
                  ) : index === 2 ? (
                    <div style={{ fontSize: "3rem", color: "black", textAlign: "center" }}>
                      10M <span style={{ fontSize: "1rem", color: "black" }}>Subscribers</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: "3rem", color: "black", textAlign: "center" }}>
                      199K <span style={{ fontSize: "1rem", color: "black" }}>US Dollars</span>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* White Cards Section (2x2 Grid) with Graphs */}
        <Row>
          {Array.from({ length: 4 }).map((_, index) => (
            <Col xs={12} sm={6} md={6} key={index} className="mb-4">
              <Card
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  border: "none",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0px 8px 30px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.1)";
                }}
              >
                <Card.Body>
                  <h5 style={{ textAlign: "center" }}>Graphs</h5>
                  {index === 0 && <Bar data={barData} options={{ responsive: true }} />}
                  {index === 1 && <Pie data={pieData} options={{ responsive: true }} />}
                  {index === 2 && <Line data={lineData} options={{ responsive: true }} />}
                  {index === 3 && <Bar data={barData} options={{ responsive: true }} />} {/* Placeholder for Histogram */}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Top Creators Table */}
        {showTopCreators && (
          <Row className="mb-4">
            <Col xs={12}>
              <Card>
                <Card.Body>
                  <h5 style={{ textAlign: "center" }}>Top Creators</h5>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Subscribers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCreatorsData.map((creator) => (
                        <tr key={creator.id}>
                          <td>{creator.name}</td>
                          <td>{creator.subscribers}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default Dashboard;