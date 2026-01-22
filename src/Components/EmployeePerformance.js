"use client"; // Required for client-side React hooks
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../Styles/performance.css";
import { useRouter } from "next/navigation";

const EmployeePerformance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://perform-ultra-backend.vercel.app/api";

  useEffect(() => {
    const fetchPerformanceData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login"); // Redirect if not logged in
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/perfor`, {
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
  }, [router, API_URL]);

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
