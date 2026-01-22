import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../Styles/UserTasksPage.css";

const UserTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserTasks();
  }, []);

  const fetchUserTasks = async () => {
    try {
      const userId = localStorage.getItem("userId"); // 🔸 Get user ID from localStorage

      if (!userId) {
        setError("User not logged in.");
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/user-assignments/${userId}`);
      setTasks(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch assigned tasks.");
    }
  };

  return (
    <div className="user-tasks-layout">
      <Sidebar />
      <main className="user-tasks-content">
        <h1 className="user-tasks-title">Assigned Tasks</h1>
        {error && <div className="user-tasks-error">{error}</div>}

        <div className="user-tasks-grid">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.TA_ID} className="user-task-card">
                <h2 className="user-task-title">{task.task_title}</h2>
                <p className="user-task-desc">{task.description}</p>
                <p className="user-task-status">
                  <strong>Status:</strong> {task.completion_status}
                </p>
              </div>
            ))
          ) : (
            <p className="user-tasks-empty">No tasks found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserTasksPage;
