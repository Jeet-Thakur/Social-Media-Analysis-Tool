import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Line, Bar, Pie } from "react-chartjs-2";
import { jwtDecode } from "jwt-decode";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  FaSearch,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  // Charts Section state and ref
  const [showCharts, setShowCharts] = useState(false);
  const [chartsStyle, setChartsStyle] = useState({
    opacity: "0",
    transform: "translateY(-50px)",
    transition: "all 1s ease-out",
  });
  const chartsRef = useRef(null);

  // Fourth Grid Section (pop animations) state and ref
  const [popIn, setPopIn] = useState([false, false, false, false]);
  const [fourthGridStyle, setFourthGridStyle] = useState({
    opacity: "0",
    transition: "opacity 1s ease-out",
  });
  const fourthSectionRef = useRef(null);

  // Second Grid (scrolling text) state and ref
  const initialSecondStyle = {
    opacity: "0",
    transform: "translateX(100px)",
    transition: "all 1s ease-out",
  };
  const [secondGridStyle, setSecondGridStyle] = useState(initialSecondStyle);
  const secondGridRef = useRef(null);

  const navigate = useNavigate();

  // Observer for charts section (data visualization)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setChartsStyle({
              opacity: "1",
              transform: "translateY(0)",
              transition: "all 1s ease-out",
            });
            setShowCharts(true);
          } else {
            setChartsStyle({
              opacity: "0",
              transform: "translateY(-50px)",
              transition: "all 1s ease-out",
            });
          }
        });
      },
      { threshold: 0.3 }
    );
    if (chartsRef.current) {
      observer.observe(chartsRef.current);
    }
    return () => {
      if (chartsRef.current) {
        observer.unobserve(chartsRef.current);
      }
    };
  }, []);

  // Observer for second grid section (scrolling text)
  useEffect(() => {
    const secondObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSecondGridStyle({
              opacity: "1",
              transform: "translateX(0)",
              transition: "all 1s ease-out",
            });
          } else {
            setSecondGridStyle(initialSecondStyle);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (secondGridRef.current) {
      secondObserver.observe(secondGridRef.current);
    }
    return () => {
      if (secondGridRef.current) {
        secondObserver.unobserve(secondGridRef.current);
      }
    };
  }, [initialSecondStyle]);

  // Observer for fourth grid section (pop animations)
  useEffect(() => {
    const fourthObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFourthGridStyle({
              opacity: "1",
              transition: "opacity 1s ease-out",
            });
            // Trigger staggered pop-in for items
            popIn.forEach((_, index) => {
              setTimeout(() => {
                setPopIn((prev) => {
                  const newState = [...prev];
                  newState[index] = true;
                  return newState;
                });
              }, 300 * (index + 1));
            });
          } else {
            setFourthGridStyle({
              opacity: "0",
              transition: "opacity 1s ease-out",
            });
            setPopIn([false, false, false, false]);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (fourthSectionRef.current) {
      fourthObserver.observe(fourthSectionRef.current);
    }
    return () => {
      if (fourthSectionRef.current) {
        fourthObserver.unobserve(fourthSectionRef.current);
      }
    };
  }, [popIn]);

  // Graph Data
  const subscribersData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Subscribers Count",
        data: [120, 190, 300, 500, 200, 700],
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const engagementData = {
    labels: ["Likes", "Shares", "Comments", "Views"],
    datasets: [
      {
        label: "Engagement Statistics",
        data: [300, 150, 400, 700],
        backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
      },
    ],
  };

  const pieData = {
    labels: ["Facebook", "Twitter", "Instagram", "LinkedIn"],
    datasets: [
      {
        data: [400, 300, 500, 200],
        backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
      },
    ],
  };

  const audienceReachData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Audience Reach Trend",
        data: [150, 250, 350, 450, 300, 600],
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };
  const token = localStorage.getItem("token");
  let userName = "";
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      // Adjust the property name according to how you store it (e.g., "name" or "username").
      userName = decoded.name || "";
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  return (
    <div className="container-fluid p-0">
      {/* Sticky Header */}
      <header
        className="sticky-top bg-black text-white shadow-sm"
        style={{ overflowX: "hidden" }}
      >
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-2">
            <div className="d-flex align-items-center">
              <img
                src="/logo.png"
                alt="Amrita Socials Logo"
                style={{
                  height: "60px",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
                className="me-3"
              />

            </div>
            <div>
              {token && userName ? (
                <div className="d-flex align-items-center">
                  <span className="me-3">Welcome, {userName}</span>
                  <button
                    className="btn btn-outline-warning rounded-pill"
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-warning btn-lg rounded-pill"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div
        className="vh-100 d-flex align-items-center"
        style={{
          background: "linear-gradient(to right, #3674B5, #4A90E2)",
          overflowX: "hidden",
        }}
      >
        <div className="container">
          <div className="row align-items-center px-3">
            <div className="col-md-6 text-start">
              <h1 className="display-3 fw-bold text-white">Amrita Socials</h1>
              <p className="lead text-white">
                Welcome to Amrita Socials, your go-to platform for in-depth
                social media analytics. Track and analyze the performance of
                your profiles with real-time insights on growth, engagement, and
                audience reach. Understand the impact of your content, monitor
                key metrics, and make data-driven decisions to enhance your
                social media strategy. Whether you're an individual creator, a
                business, or a marketing professional, our intuitive dashboard
                helps you stay ahead in the digital landscape with comprehensive
                analytics and visualizations.
              </p>
              <button
                className="btn btn-warning btn-lg rounded-pill"
                onClick={() => navigate("/signup")}
              >
                Register
              </button>
            </div>
            <div className="col-md-6 text-center">
              <img
                src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*SG-NyKwhKqtWCXHw0dwu3g.gif"
                alt="Hero"
                className="img-fluid"
                style={{ height: "800px", width: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Text Section */}
      <div
        ref={secondGridRef}
        className="container-fluid py-5"
        style={{ background: "#FFFED3", color: "#000", ...secondGridStyle }}
      >
        <div className="overflow-hidden">
          <h1 className="display-4 fw-bold text-nowrap text-end pe-5 ms-4">
            Learn about the impact of contents on <br />
            social media with our Tool
          </h1>
        </div>
        <div className="container my-5">
          <div className="row g-4">
            {[...Array(6)].map((_, index) => (
              <div className="col-md-4" key={index}>
                <div
                  className="p-4 text-black text-start border border-dark rounded shadow-sm bg-white"
                  style={{ transition: "transform 0.3s ease-in-out" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <h5 className="fw-bold">Profile Performance Report</h5>
                  <p>
                    Access a high-level overview of performance across all
                    connected profiles to quickly evaluate social growth.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Visualization Section */}
      <div
        ref={chartsRef}
        className="container-fluid py-5 bg-light"
        style={{ ...chartsStyle, background: "#FFFED3", color: "#000" }}
      >
        <h1 className="display-4 fw-bold text-center mb-5">
          Visualize Your Social Media Growth
        </h1>
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="p-4 border rounded bg-white shadow-sm">
                <h5 className="fw-bold text-center">
                  Subscribers Growth Over Time
                </h5>
                {showCharts && <Line data={subscribersData} />}
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 border rounded bg-white shadow-sm">
                <h5 className="fw-bold text-center">Engagement Statistics</h5>
                {showCharts && <Bar data={engagementData} />}
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 border rounded bg-white shadow-sm d-flex flex-column align-items-center">
                <h5 className="fw-bold text-center">Platform Distribution</h5>
                <div style={{ width: "70%", height: "295px" }}>
                  {showCharts && <Pie data={pieData} />}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 border rounded bg-white shadow-sm">
                <h5 className="fw-bold text-center">Audience Reach Trend</h5>
                {showCharts && <Line data={audienceReachData} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fourth Grid Section */}
      <div
        ref={fourthSectionRef}
        className="container-fluid py-5"
        style={{ background: "#FFFED3", color: "#000", ...fourthGridStyle }}
      >
        <div className="container">
          <h1 className="text-align-right fw-bold mb-4">
            Discover How Amrita Socials Transforms Your
            <br /> Digital Engagement Journey Today
          </h1>
          <br />
          <div className="row align-items-center">
            {/* Left side image */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img
                src="https://lh3.googleusercontent.com/proxy/4r23ta0LOswKRlygV999KpUSINg8yPE8ASLEoUbxS7UjU6TlqQiWG9T1tepPxwPL6CHu0ujXleqvKD2pxfbLB7jxeNG6yb2hLMLJwjdjZhfeP4fmtk8myOSidegGQ3W9h4PQ9q0ypFr-BhruiikT9PAzMhKcvrEC4EeaOMAeMb2pOI0fqSxougedEVHMNGH0l9Qky0jxjhJYyZ_5P2eYhyJMINFujXoXzWeoDRh-Ad3a7om2j0TEcm41"
                alt="Left side visual"
                className="img-fluid rounded shadow"
              />
            </div>
            {/* Right side vertical list with pop animation */}
            <div className="col-lg-6">
              <div className="d-flex flex-column align-items-start">
                {/* 1. Conduct deep research */}
                <div
                  className={`d-flex mb-4 justify-content-end fade ${
                    popIn[0] ? "show" : ""
                  }`}
                >
                  <div
                    className="me-3 text-center"
                    style={{ minWidth: "50px" }}
                  >
                    <div
                      className="rounded-circle bg-success d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <span className="text-white fw-bold">🔍</span>
                    </div>
                    <div
                      className="mx-auto"
                      style={{
                        width: "2px",
                        height: "50px",
                        backgroundColor: "#ccc",
                      }}
                    />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Upload The Dataset</h5>
                    <p className="mb-0">
                      Upload your dataset to process, analyze trends, and
                      extract meaningful insights for informed decision-making.
                    </p>
                  </div>
                </div>
                {/* 2. Monitor your brand */}
                <div
                  className={`d-flex mb-4 justify-content-end fade ${
                    popIn[1] ? "show" : ""
                  }`}
                >
                  <div
                    className="me-3 text-center"
                    style={{ minWidth: "50px" }}
                  >
                    <div
                      className="rounded-circle bg-success d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <span className="text-white fw-bold">📊</span>
                    </div>
                    <div
                      className="mx-auto"
                      style={{
                        width: "2px",
                        height: "50px",
                        backgroundColor: "#ccc",
                      }}
                    />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">
                      Uncover trends and drive data insights.
                    </h5>
                    <p className="mb-0">
                      Uncover hidden trends, analyze engagement, and gain
                      insights to better understand social media dynamics,
                      audience behavior, and content impact effectively.
                    </p>
                  </div>
                </div>
                {/* 3. Create winning content */}
                <div
                  className={`d-flex mb-4 justify-content-end fade ${
                    popIn[2] ? "show" : ""
                  }`}
                >
                  <div
                    className="me-3 text-center"
                    style={{ minWidth: "50px" }}
                  >
                    <div
                      className="rounded-circle bg-success d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <span className="text-white fw-bold">⭐</span>
                    </div>
                    <div
                      className="mx-auto"
                      style={{
                        width: "2px",
                        height: "50px",
                        backgroundColor: "#ccc",
                      }}
                    />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Setiment analysis</h5>
                    <p className="mb-0">
                      Sentiment analysis critically examines social media
                      content to determine emotional tone, revealing audience
                      opinions, engagement levels, and overall brand perception.
                    </p>
                  </div>
                </div>
                {/* 4. Engage with consumers */}
                <div
                  className={`d-flex justify-content-end fade ${
                    popIn[3] ? "show" : ""
                  }`}
                >
                  <div
                    className="me-3 text-center"
                    style={{ minWidth: "50px" }}
                  >
                    <div
                      className="rounded-circle bg-success d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <span className="text-white fw-bold">👥</span>
                    </div>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">
                      Analyze, interpret, optimize social media.
                    </h5>
                    <p className="mb-0">
                      Social media analytics collects, processes, and interprets
                      online data to reveal user behavior patterns, engagement
                      metrics, and trends, enabling optimized content strategies
                      and brand insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <h5>Follow Us</h5>
              <div className="d-flex justify-content-center">
                <a
                  href="https://facebook.com"
                  className="text-white mx-2"
                  aria-label="Facebook"
                >
                  <FaFacebook size={30} />
                </a>
                <a
                  href="https://twitter.com"
                  className="text-white mx-2"
                  aria-label="Twitter"
                >
                  <FaTwitter size={30} />
                </a>
                <a
                  href="https://instagram.com"
                  className="text-white mx-2"
                  aria-label="Instagram"
                >
                  <FaInstagram size={30} />
                </a>
                <a
                  href="https://linkedin.com"
                  className="text-white mx-2"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={30} />
                </a>
              </div>
              <p className="mt-3">
                &copy; {new Date().getFullYear()} Amrita Socials. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
