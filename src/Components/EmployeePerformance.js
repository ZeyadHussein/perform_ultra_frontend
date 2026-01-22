import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../Styles/performance.css";
import { useNavigate } from "react-router-dom";

const EmployeePerformance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerformanceData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect if not logged in
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/perfor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPerformanceData(response.data);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [navigate]);

  return (
    <div className="performance-container">
      <Sidebar />
      <main className="performance-content">
        <div className="performance-section">
          <h3>Employee Performance</h3>
          {loading ? (
            <p>Loading performance data...</p>
          ) : performanceData.length > 0 ? (
            <div className="performance-cards">
              {performanceData.map((item, index) => (
                <div className="performance-card" key={index}>
                  <h4>{item.Full_Name}</h4>
                  <p>
                    <strong>{item.Task_completed}%</strong> Tasks Completed
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No performance data available.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeePerformance;
