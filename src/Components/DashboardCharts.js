
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faGooglePlus,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import Link from "/link";
import "../Styles/Dashboard.css";

const generateUniqueColors = (count) => {
  const colors = [];
  const saturation = 70;
  const lightness = 60;
  for (let i = 0; i < count; i++) {
    const hue = Math.floor((360 / count) * i);
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
};

const DashboardCharts = () => {
  const API_URL = process.env.REACT_APP_API_URL || "https://perform-ultra-backend.vercel.app/api";

  const [employees, setEmployees] = useState([]);
  const [managersWithUsers, setManagersWithUsers] = useState([]);
  const [taskSummary, setTaskSummary] = useState({
    total: 0,
    completed: 0,
    incomplete: 0,
  });

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);

  useEffect(() => {
    // Fetch Employees
    axios
      .get(`${API_URL}/employees-with-users`)
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));

    // Fetch Managers with Users
    axios
      .get(`${API_URL}/managers-with-users`)
      .then((res) => setManagersWithUsers(res.data))
      .catch((err) => console.error("Error fetching managers:", err));

    // Fetch Task Summary
    axios
      .get(`${API_URL}/task-assignment-summary`)
      .then((res) => setTaskSummary(res.data))
      .catch((err) => console.error("Error fetching task summary:", err));
  }, [API_URL]);

  // Task stats
  const { total: totalTasks, completed: completedTasks, incomplete: incompletedTasks } = taskSummary;

  // Department Pie Chart
  const departmentCounts = employees.reduce((acc, emp) => {
    const dept = emp.Department_name || "Unknown";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});
  const departmentPieData = Object.entries(departmentCounts).map(([name, value]) => ({ name, value }));
  const departmentColors = generateUniqueColors(departmentPieData.length);

  // Average hourly rate per department
  const deptHourly = {};
  employees.forEach((emp) => {
    const dept = emp.Department_name || "Unknown";
    if (!deptHourly[dept]) deptHourly[dept] = { total: 0, count: 0 };
    deptHourly[dept].total += emp.hourly_rate;
    deptHourly[dept].count += 1;
  });
  const avgHourlyData = Object.entries(deptHourly).map(([name, stats]) => ({
    name,
    avgRate: parseFloat((stats.total / stats.count).toFixed(2)),
  }));

  // Role Distribution Pie Chart
  const uniqueEmployeeIDs = new Set(employees.map((emp) => emp.User_ID));
  const uniqueManagerIDs = new Set(managersWithUsers.map((mgr) => mgr.User_ID));
  const onlyManagers = [...uniqueManagerIDs].filter((id) => !uniqueEmployeeIDs.has(id));
  const onlyEmployees = [...uniqueEmployeeIDs].filter((id) => !uniqueManagerIDs.has(id));
  const roleDistributionData = [
    { name: "Only Managers", value: onlyManagers.length },
    { name: "Only Employees", value: onlyEmployees.length },
  ];
  const roleColors = ["#FF0000", "#0000FF", "#00C49F"];

  return (
    <div className="page-container">
      <Sidebar />
      <div className="content-wrapper">
        <h1>Employee Dashboard</h1>

        <div className="dashboard-cards">
          <div className="user-task-card total-employees">
            <h4>Total Employees</h4>
            <p className="ds">{employees.length}</p>
            <span className="stat">+35% This Month</span>
          </div>
          <div className="user-task-card total-tasks">
            <h4>Total Tasks</h4>
            <p className="ds">{totalTasks}</p>
            <span className="stat">+35% This Month</span>
          </div>
          <div className="user-task-card completed-tasks">
            <h4>Completed Tasks</h4>
            <p className="ds">{completedTasks}</p>
            <span className="stat">+35% This Month</span>
          </div>
          <div className="user-task-card incompleted-tasks">
            <h4>Incompleted Tasks</h4>
            <p className="ds">{incompletedTasks}</p>
            <span className="stat">+35% This Month</span>
          </div>
        </div>

        {/* Department Pie Chart */}
        <div className="chart-box">
          <h3>Employees per Department</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={departmentPieData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                onClick={(data) => setSelectedDepartment(data.name)}
              >
                {departmentPieData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={departmentColors[i]}
                    stroke={entry.name === selectedDepartment ? "#000" : ""}
                    strokeWidth={entry.name === selectedDepartment ? 3 : 1}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
          {selectedDepartment && (
            <p className="chart-info">
              Selected Department: <strong>{selectedDepartment}</strong>
            </p>
          )}
        </div>

        {/* Average Hourly Rate Bar Chart */}
        <div className="chart-card">
          <h3>Average Hourly Rate by Department</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={avgHourlyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgRate" onClick={(data) => setSelectedBar(data.name)}>
                {avgHourlyData.map((entry, i) => (
                  <Cell key={i} fill={entry.name === selectedBar ? "#FF6F91" : "#845EC2"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {selectedBar && (
            <p className="chart-info">
              Selected Department (Hourly Rate): <strong>{selectedBar}</strong>
            </p>
          )}
        </div>

        {/* Role Pie Chart */}
        <div className="chart-card">
          <h3>Managers and Employees</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={roleDistributionData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
                onClick={(data) => setSelectedRole(data.name)}
              >
                {roleDistributionData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={roleColors[i]}
                    stroke={entry.name === selectedRole ? "#000" : ""}
                    strokeWidth={entry.name === selectedRole ? 3 : 1}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          {selectedRole && (
            <p className="chart-info">
              Selected Role: <strong>{selectedRole}</strong>
            </p>
          )}
        </div>

        <section className="dashboard-cards small">
          <div className="user-task-card total-managers">
            <h4>Total Managers</h4>
            <p className="ds">{uniqueManagerIDs.size}</p>
            <span className="stat">Updated</span>
          </div>
          <div className="user-task-card total-employees-small">
            <h4>Total Employees</h4>
            <p className="ds">{uniqueEmployeeIDs.size}</p>
            <span className="stat">Updated</span>
          </div>
        </section>

        <footer>
          <div className="footerContain">
            <div className="socialIcons">
              {[faFacebook, faInstagram, faTwitter, faGooglePlus, faYoutube].map((icon, i) => (
                <button key={i} onClick={() => console.log(icon.iconName)}>
                  <FontAwesomeIcon icon={icon} size="2x" />
                </button>
              ))}
            </div>
            <div className="footerNav">
              <ul>
                <li>
                  <Link to="/homepage">Home</Link>
                </li>
                <li>
                  <Link to="/news">News</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
              </ul>
            </div>
            <div className="footerBott">
              <p>&copy;2025 PerformUltra. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardCharts;
