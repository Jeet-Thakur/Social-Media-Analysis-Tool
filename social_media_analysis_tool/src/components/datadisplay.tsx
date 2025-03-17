import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Table, Form, Button } from 'react-bootstrap';

const DataDisplay: React.FC = () => {
  const [channelName, setChannelName] = useState<string>('');
  const [chartData, setChartData] = useState<any>(null);
  const [engagementMetrics, setEngagementMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Video upload form state
  const [videoDetails, setVideoDetails] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
  });

  // Predicted metrics state
  const [predictedMetrics, setPredictedMetrics] = useState<any>(null);

  // YouTube Data API key
  const API_KEY = 'AIzaSyDSv_VzYVUXbsC82xHEb2zDnaCfpJdjPic'; // Replace with your YouTube API key

  // Function to fetch data based on channel name
  const fetchData = async () => {
    if (!channelName) {
      setError('Please enter a channel name.');
      return;
    }

    setLoading(true);
    setError(null);
    setChartData(null);
    setEngagementMetrics(null);

    try {
      // Step 1: Fetch channel ID using the channel name
      const searchResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: 'snippet',
            q: channelName,
            type: 'channel',
            key: API_KEY,
          },
        }
      );

      console.log('Search Response:', searchResponse.data);

      const channelId = searchResponse.data.items[0]?.id?.channelId;
      if (!channelId) {
        throw new Error('Channel not found.');
      }

      // Step 2: Fetch channel statistics using the channel ID
      const channelResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels`,
        {
          params: {
            part: 'statistics',
            id: channelId,
            key: API_KEY,
          },
        }
      );

      console.log('Channel Response:', channelResponse.data);

      const channelStats = channelResponse.data.items[0]?.statistics;
      if (!channelStats) {
        throw new Error('Channel statistics not found.');
      }

      // Step 3: Fetch video data for the channel (e.g., top 10 videos)
      const videosResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: 'snippet',
            channelId: channelId,
            maxResults: 10,
            order: 'viewCount',
            type: 'video',
            key: API_KEY,
          },
        }
      );

      console.log('Videos Response:', videosResponse.data);

      const videoIds = videosResponse.data.items.map((item: any) => item.id.videoId).join(',');

      // Step 4: Fetch video statistics for the top 10 videos
      const videoStatsResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos`,
        {
          params: {
            part: 'statistics,snippet',
            id: videoIds,
            key: API_KEY,
          },
        }
      );

      console.log('Video Stats Response:', videoStatsResponse.data);

      const videoStats = videoStatsResponse.data.items;
      if (!videoStats || videoStats.length === 0) {
        throw new Error('Video statistics not found.');
      }

      // Prepare chart data
      const labels = videoStats.map((video: any) => video.snippet.title);
      const views = videoStats.map((video: any) => parseInt(video.statistics.viewCount));

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Views',
            data: views,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      });

      // Prepare engagement metrics
      setEngagementMetrics({
        channel: {
          subscribers: channelStats.subscriberCount || 'N/A',
          views: channelStats.viewCount || 'N/A',
          videos: channelStats.videoCount || 'N/A',
        },
        topVideos: videoStats.map((video: any) => ({
          title: video.snippet?.title || 'N/A',
          views: video.statistics?.viewCount || 'N/A',
          likes: video.statistics?.likeCount || 'N/A',
          comments: video.statistics?.commentCount || 'N/A',
        })),
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle video upload form submission
  const handleVideoUpload = (e: React.FormEvent) => {
    e.preventDefault();

    if (!engagementMetrics) {
      setError('Please fetch channel data first.');
      return;
    }

    // Calculate average metrics for prediction
    const totalVideos = engagementMetrics.topVideos.length;
    const totalViews = engagementMetrics.topVideos.reduce(
      (sum: number, video: any) => sum + parseInt(video.views),
      0
    );
    const totalLikes = engagementMetrics.topVideos.reduce(
      (sum: number, video: any) => sum + parseInt(video.likes),
      0
    );
    const totalComments = engagementMetrics.topVideos.reduce(
      (sum: number, video: any) => sum + parseInt(video.comments),
      0
    );

    const averageViews = Math.round(totalViews / totalVideos);
    const averageLikes = Math.round(totalLikes / totalVideos);
    const averageComments = Math.round(totalComments / totalVideos);

    // Set predicted metrics
    setPredictedMetrics({
      title: videoDetails.title,
      estimatedViews: averageViews,
      estimatedLikes: averageLikes,
      estimatedComments: averageComments,
    });
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#F8FAFC' }}>
      <h1 style={{ textAlign: 'center' }}>Data Display</h1>

      {/* Channel Name Input */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter Channel Name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginRight: '10px',
          }}
        />
        <button
          onClick={fetchData}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#1E3A8A',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Fetch Data
        </button>
      </div>

      {/* Loading State */}
      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}

      {/* Error Message */}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

      {/* Chart Section */}
      {chartData && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ textAlign: 'center' }}>Data Visualization</h2>
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
      )}

      {/* Engagement Metrics Section */}
      {engagementMetrics && (
        <div>
          <h2 style={{ textAlign: 'center' }}>Engagement Metrics</h2>

          {/* Channel Metrics */}
          <h3 style={{ textAlign: 'center' }}>Channel Metrics</h3>
          <Table striped bordered hover style={{ maxWidth: '600px', margin: 'auto' }}>
            <thead>
              <tr>
                <th>Subscribers</th>
                <th>Views</th>
                <th>Videos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{engagementMetrics.channel.subscribers}</td>
                <td>{engagementMetrics.channel.views}</td>
                <td>{engagementMetrics.channel.videos}</td>
              </tr>
            </tbody>
          </Table>

          {/* Top Videos Metrics */}
          <h3 style={{ textAlign: 'center', marginTop: '20px' }}>Top Videos</h3>
          <Table striped bordered hover style={{ maxWidth: '800px', margin: 'auto' }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {engagementMetrics.topVideos.map((video: any, index: number) => (
                <tr key={index}>
                  <td>{video.title}</td>
                  <td>{video.views}</td>
                  <td>{video.likes}</td>
                  <td>{video.comments}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Video Upload Form */}
      {engagementMetrics && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h2>Upload New Video</h2>
          <Form onSubmit={handleVideoUpload} style={{ maxWidth: '500px', margin: 'auto' }}>
            <Form.Group controlId="videoTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter video title"
                value={videoDetails.title}
                onChange={(e) =>
                  setVideoDetails({ ...videoDetails, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="videoDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter video description"
                value={videoDetails.description}
                onChange={(e) =>
                  setVideoDetails({ ...videoDetails, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="videoCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter video category"
                value={videoDetails.category}
                onChange={(e) =>
                  setVideoDetails({ ...videoDetails, category: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="videoTags">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter video tags (comma-separated)"
                value={videoDetails.tags}
                onChange={(e) =>
                  setVideoDetails({ ...videoDetails, tags: e.target.value })
                }
              />
            </Form.Group>

            <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
              Predict Metrics
            </Button>
          </Form>
        </div>
      )}

      {/* Predicted Metrics Section */}
      {predictedMetrics && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h2>Predicted Metrics</h2>
          <Table striped bordered hover style={{ maxWidth: '600px', margin: 'auto' }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Estimated Views</th>
                <th>Estimated Likes</th>
                <th>Estimated Comments</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{predictedMetrics.title}</td>
                <td>{predictedMetrics.estimatedViews}</td>
                <td>{predictedMetrics.estimatedLikes}</td>
                <td>{predictedMetrics.estimatedComments}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}

      {/* Fallback message if no data is available */}
      {!chartData && !engagementMetrics && !loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>No data available to display. Enter a channel name and click "Fetch Data".</p>
        </div>
      )}
    </div>
  );
};

export default DataDisplay;