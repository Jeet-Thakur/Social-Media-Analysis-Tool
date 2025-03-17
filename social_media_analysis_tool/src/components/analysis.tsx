import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Card, Row, Col, Button, Form, Nav } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Analysis: React.FC = () => {
  const [companyName, setCompanyName] = useState("");
  const [collaborationGoals, setCollaborationGoals] = useState("");
  const [region, setRegion] = useState("");
  const [genre, setGenre] = useState("");
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [channelData, setChannelData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // For Analytics dropdown
  const navigate = useNavigate();

  // Genre options
  const genres = [
    "Music",
    "Gaming",
    "Tech",
    "Fashion",
    "Fitness",
    "Travel",
    "Food",
    "Education",
    "Comedy",
    "Sports",
  ];

  // Fetch real-time channel data for the selected region and genre
  const fetchChannelsByRegionAndGenre = async () => {
    const apiKey = "AIzaSyBlkSOvi3EVnCwz9_N_mCQ3fKAbRhuh49E"; // Replace with your YouTube API key
    setLoading(true);
    try {
      // Use the YouTube Search API to find channels in the specified region and genre
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&regionCode=${region}&q=${genre}&maxResults=10&key=${apiKey}`
      );

      // Extract channel IDs from the response
      const channelIds = response.data.items.map((item: any) => item.snippet.channelId);

      // Fetch detailed statistics for each channel
      const channelsData = await Promise.all(
        channelIds.map(async (channelId: string) => {
          const statsResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`
          );
          return statsResponse.data.items[0];
        })
      );

      // Sort channels by subscriber count (descending)
      const sortedChannels = channelsData.sort(
        (a: any, b: any) => parseInt(b.statistics.subscriberCount) - parseInt(a.statistics.subscriberCount)
      );

      // Set the channels state with the fetched data
      setChannels(sortedChannels);
    } catch (error) {
      console.error("Error fetching channel data:", error);
      alert("Failed to fetch channel data. Please check the region, genre, or API key.");
    } finally {
      setLoading(false);
    }
  };

  // Handle channel selection
  const handleChannelSelect = (channelId: string, channelName: string) => {
    setSelectedChannel(channelId);
    const selectedChannelData = channels.find((channel) => channel.id === channelId);
    setChannelData(selectedChannelData);
  };

  // Calculate engagement rate based on views and subscribers
  const calculateEngagementRate = (data: any) => {
    const views = parseInt(data.statistics.viewCount) || 0;
    const subscribers = parseInt(data.statistics.subscriberCount) || 1; // Avoid division by zero
    return ((views / subscribers) * 100).toFixed(2); // Engagement rate as a percentage
  };

  // Handle submitting collaboration request
  const handleSubmit = async () => {
    if (!companyName.trim() || !selectedChannel || !collaborationGoals.trim() || !region.trim() || !genre.trim()) {
      alert("Please fill in all fields and select a channel.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: companyName,
          selected_channel: selectedChannel,
          collaboration_goals: collaborationGoals,
          region: region,
          genre: genre,
        }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        alert("Collaboration request submitted successfully!");
        setCompanyName("");
        setCollaborationGoals("");
        setRegion("");
        setGenre("");
        setSelectedChannel(null);
        setChannelData(null);
      } else {
        alert("Failed to submit collaboration request.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the request.");
    }
  };

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
          <span style={{ fontSize: "1.3rem", fontWeight: "bold" }}>Collaboration</span>
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
            onClick={() => {
              if (text === "Home") navigate("/dashboard");
              if (text === "Top List") navigate("/top-list");
            }}
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
                  onClick={() => {
                    if (item === "Analysis") navigate("/analysis");
                    if (item === "Trend") navigate("/trend");
                    if (item === "Filter") navigate("/filter");
                  }}
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
        {/* Company Name Input */}
        <Row className="mb-4">
          <Col xs={12}>
            <Card>
              <Card.Body>
                <h5 style={{ textAlign: "center" }}>Enter Company Name</h5>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Collaboration Goals Input */}
        <Row className="mb-4">
          <Col xs={12}>
            <Card>
              <Card.Body>
                <h5 style={{ textAlign: "center" }}>Collaboration Goals</h5>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Describe your collaboration goals"
                    value={collaborationGoals}
                    onChange={(e) => setCollaborationGoals(e.target.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Region Selection */}
        <Row className="mb-4">
          <Col xs={12}>
            <Card>
              <Card.Body>
                <h5 style={{ textAlign: "center" }}>Select Region</h5>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter region code (e.g., US, IN)"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Genre Selection */}
        <Row className="mb-4">
          <Col xs={12}>
            <Card>
              <Card.Body>
                <h5 style={{ textAlign: "center" }}>Select Genre</h5>
                <Form.Group className="mb-3">
                  <Form.Select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                  >
                    <option value="">Select a genre</option>
                    {genres.map((genreOption) => (
                      <option key={genreOption} value={genreOption}>
                        {genreOption}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Fetch Channels Button */}
        <Row className="mb-4">
          <Col xs={12}>
            <Button variant="primary" onClick={fetchChannelsByRegionAndGenre} style={{ width: "100%" }}>
              Fetch Channels
            </Button>
          </Col>
        </Row>

        {/* Display Channels */}
        {channels.length > 0 && (
          <Row className="mb-4">
            <Col xs={12}>
              <Card>
                <Card.Body>
                  <h5 style={{ textAlign: "center" }}>Top Channels in {region} ({genre})</h5>
                  <Form>
                    {channels.map((channel) => (
                      <div key={channel.id} className="mb-2">
                        <Form.Check
                          type="radio"
                          label={`${channel.snippet.title} - ${channel.statistics.subscriberCount} Subscribers`}
                          name="channelSelect"
                          checked={selectedChannel === channel.id}
                          onChange={() => handleChannelSelect(channel.id, channel.snippet.title)}
                        />
                      </div>
                    ))}
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Display Channel Metrics */}
        {selectedChannel && channelData && (
          <Row className="mb-4">
            <Col xs={12}>
              <Card>
                <Card.Body>
                  <h5 style={{ textAlign: "center" }}>Channel Metrics</h5>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <>
                      <img src={channelData.snippet.thumbnails.default.url} alt="Channel Thumbnail" style={{ width: "100px", display: "block", margin: "0 auto" }} />
                      <p>Subscribers: {channelData.statistics.subscriberCount}</p>
                      <p>Total Views: {channelData.statistics.viewCount}</p>
                      <p>Total Videos: {channelData.statistics.videoCount}</p>
                      <p>Engagement Rate: {calculateEngagementRate(channelData)}%</p>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Submit Collaboration Request */}
        <Row>
          <Col xs={12}>
            <Button variant="primary" onClick={handleSubmit} style={{ width: "100%" }}>
              Submit Collaboration Request
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Analysis;