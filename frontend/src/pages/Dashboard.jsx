import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-css">
      <div className="time-css">
        <p>Current Time: {formatTime(currentTime)}</p>
        <p>Date: {currentTime.toLocaleDateString()}</p>
      </div>
    </div>
  );
};

const formatTime = (time) => {
  const options = {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Use 12-hour clock format
  };
  return time.toLocaleTimeString([], options);
};

export default Dashboard;
