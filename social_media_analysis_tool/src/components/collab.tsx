import React, { useState, useEffect } from "react";
import { Card, Table, Button } from "react-bootstrap";
import * as XLSX from "xlsx";

const Collaboration: React.FC = () => {
  const [channelData, setChannelData] = useState<any[]>([]);
  const [collaboratedChannels, setCollaboratedChannels] = useState<string[]>([]);

  useEffect(() => {
    // Load and parse the Excel file
    const fetchData = async () => {
      try {
        const response = await fetch("YouTube_Channel_Data_10k.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        // Add an ID to each channel and sort by subscribers
        const sortedData = data
          .map((channel: any, index: number) => ({
            ...channel,
            id: index + 1, // Adding a unique ID
          }))
          .sort((a: any, b: any) => b.Subscribers - a.Subscribers);

        setChannelData(sortedData.slice(0, 10)); // Get top 10 channels
      } catch (error) {
        console.error("Error fetching Excel file:", error);
      }
    };

    fetchData();
  }, []);

  const handleCollaborate = (channelId: number) => {
    const channel = channelData.find((ch) => ch.id === channelId);
    if (channel) {
      setCollaboratedChannels([...collaboratedChannels, channel.ChannelName]);
      setChannelData(channelData.filter((ch) => ch.id !== channelId));
    }
  };

  return (
    <div className="p-4">
      <h3 className="mb-4">Channel Collaboration</h3>
      <Card className="p-3">
        <h4>Top 10 Channels for Collaboration</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Subscribers</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {channelData.map((channel) => (
              <tr key={channel.id}>
                <td>{channel.id}</td>
                <td>{channel.ChannelName}</td>
                <td>{channel.Subscribers}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleCollaborate(channel.id)}
                    disabled={collaboratedChannels.includes(channel.ChannelName)}
                  >
                    Collaborate
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {collaboratedChannels.length > 0 && (
        <Card className="p-3 mt-4">
          <h4>Your Collaborations</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Channel Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {collaboratedChannels.map((channel, index) => (
                <tr key={index}>
                  <td>{channel}</td>
                  <td>
                    <span className="badge bg-success">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default Collaboration;