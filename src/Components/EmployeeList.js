
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faGooglePlus,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import Sidebar from "./Sidebar";
import "../Styles/EmployeeList.css";

const EmployeeList = () => {
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://perform-ultra-backend.vercel.app/api";

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, deptRes] = await Promise.all([
          axios.get(`${API_URL}/employees-with-users`),
          axios.get(`${API_URL}/departments`),
        ]);
        setEmployees(empRes.data);
        setDepartments(deptRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load employee data. Please try again later.");
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  const groupEmployeesByDepartment = () => {
    const grouped = {};
    departments.forEach((dept) => {
      grouped[dept.Department_name] = [];
    });
    grouped["Unassigned"] = [];
    employees.forEach((emp) => {
      const dept = emp.Department_name || "Unassigned";
      if (!grouped[dept]) grouped[dept] = [];
      grouped[dept].push(emp);
    });
    return grouped;
  };

  const employeesByDepartment = groupEmployeesByDepartment();

  return (
    <div className="homepage-container">
      <div className="sidebar">
        <Sidebar />
      </div>

      <main>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading employee data...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="employee-list-container">
            <h1>Employees</h1>
            {Object.entries(employeesByDepartment).map(
              ([department, emps]) =>
                emps.length > 0 && (
                  <div key={department} className="department-section">
                    <h3>{department}</h3>
                    <ul className="employee-items">
                      {emps.map((emp) => (
                        <li key={emp.Employee_ID}>
                          <div className="employee-info">
                            <span className="employee-name">{emp.Name}</span>
                            <span className="employee-details">
                              ${emp.hourly_rate}/hr | {emp.Email}
                            </span>
                            {emp.Role && (
                              <span className="employee-role">{emp.Role}</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
            )}
          </div>
        )}

        <footer>
          <div className="footerContainer">
            <div className="socialIcons">
              {[
                faFacebook,
                faInstagram,
                faTwitter,
                faGooglePlus,
                faYoutube,
              ].map((icon, i) => (
                <button key={i} onClick={() => console.log(icon.iconName)}>
                  <FontAwesomeIcon icon={icon} size="2x" />
                </button>
              ))}
            </div>
            <div className="footerNav">
              <ul>
                <li>
                  <Link href="/homepage">Home</Link>
                </li>
                <li>
                  <Link href="/news">News</Link>
                </li>
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
              </ul>
            </div>
            <div className="footerBottom">
              <p>&copy;2025 PerformUltra. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default EmployeeList;
