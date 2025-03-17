import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Title, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, Row, Col, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Title, Legend);

interface VideoData {
  Title: string;
  Views: number;
  Likes: number;
  "Published At": string;
}

const Trend: React.FC = () => {
  const [trendingVideos, setTrendingVideos] = useState<VideoData[]>([]);
  const [wordCloudUrl, setWordCloudUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState("IN");  // Default to India
  const [theme, setTheme] = useState<"light" | "dark">("dark");  // Default to dark theme
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTopCreators, setShowTopCreators] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      // Fetch trending video data
      const trendingResponse = await axios.get(`http://127.0.0.1:5000/get_trending_data?region=${region}`);
      setTrendingVideos(trendingResponse.data);

      // Fetch word cloud image
      const wordCloudResponse = await axios.get(`http://127.0.0.1:5000/wordcloud?region=${region}`);
      setWordCloudUrl(wordCloudResponse.data.wordcloud);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [region]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Define styles for light and dark themes
  const themeStyles = {
    light: {
      backgroundColor: "#ffffff",
      color: "#000000",
      tableBorderColor: "#000000",
      chartBackgroundColor: "rgba(255, 206, 86, 0.2)",
    },
    dark: {
      backgroundColor: "#121212",
      color: "#ffffff",
      tableBorderColor: "#ffffff",
      chartBackgroundColor: "yellow",
    },
  };

  const currentTheme = themeStyles[theme];

  if (loading) {
    return <p>Loading...</p>;
  }

  const chartData = {
    labels: trendingVideos.slice(0, 10).map(video => video.Title),
    datasets: [{
      label: "Views",
      data: trendingVideos.slice(0, 10).map(video => video.Views),
      backgroundColor: currentTheme.chartBackgroundColor,
    }]
  };

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

  return (
    <div style={{ display: "flex", height: "100vh", overflowX: "hidden" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#1A202C", // Updated to dark blue
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
            User Name
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
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")} // Lighter blue for hover
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
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")} // Lighter blue for hover
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
      <div style={{ flex: 1, padding: "20px", backgroundColor: currentTheme.backgroundColor, color: currentTheme.color, overflowY: "auto" }}>
        <h1>YouTube Trending Analysis</h1>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: currentTheme.color,
            color: currentTheme.backgroundColor,
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>

        {/* Country Selection Dropdown */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="region">Select Country: </label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{ padding: "5px", fontSize: "16px", backgroundColor: currentTheme.backgroundColor, color: currentTheme.color }}
          >
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="JP">Japan</option>
            <option value="CA">Canada</option>
            {/* Add more countries as needed */}
          </select>
        </div>

        <h3>Trending Video Views</h3>
        <div style={{ maxWidth: "80%", margin: "auto" }}>
          <Bar data={chartData} />
        </div>

        <h3>Top Trending Videos</h3>
        <table border={1} style={{ width: "80%", margin: "auto", borderCollapse: "collapse", borderColor: currentTheme.tableBorderColor }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Views</th>
              <th>Likes</th>
              <th>Published Date</th>
            </tr>
          </thead>
          <tbody>
            {trendingVideos.slice(0, 10).map((video, index) => (
              <tr key={index}>
                <td>{video.Title}</td>
                <td>{video.Views}</td>
                <td>{video.Likes}</td>
                <td>{new Date(video["Published At"]).toDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Trending Keywords (Word Cloud)</h3>
        {wordCloudUrl ? <img src={wordCloudUrl} alt="Word Cloud" style={{ maxWidth: "80%" }} /> : <p>Loading word cloud...</p>}

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

export default Trend;