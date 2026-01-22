"use client"; // For client-side hooks
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../Styles/ManageProjects.css";

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    Project_name: "",
    Start_date: "",
    End_date: "",
    Budget: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showProjects, setShowProjects] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://perform-ultra-backend.vercel.app/api";

  // ✅ fetchProjects moved inside useEffect to fix ESLint warning
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_URL}/projects`);
        setProjects(res.data);
      } catch (err) {
        alert("Failed to load projects");
        console.error(err);
      }
    };

    fetchProjects();
  }, [API_URL]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const handleSave = async () => {
    if (!form.Project_name.trim()) {
      alert("Project Name is required");
      return;
    }

    const budgetValue = form.Budget ? parseFloat(form.Budget) : null;
    const payload = { ...form, Budget: budgetValue };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/projects/${editingId}`, payload);
        alert("Project updated");
      } else {
        await axios.post(`${API_URL}/projects`, payload);
        alert("Project created");
      }

      setForm({ Project_name: "", Start_date: "", End_date: "", Budget: "" });
      setEditingId(null);

      // Refresh projects list
      const res = await axios.get(`${API_URL}/projects`);
      setProjects(res.data);
    } catch (err) {
      alert("Failed to save project");
      console.error(err);
    }
  };

  const handleEdit = (project) => {
    setForm({
      Project_name: project.Project_name || "",
      Start_date: project.Start_date ? formatDate(project.Start_date) : "",
      End_date: project.End_date ? formatDate(project.End_date) : "",
      Budget: project.Budget ? project.Budget.toString() : "",
    });
    setEditingId(project.Project_ID);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await axios.delete(`${API_URL}/projects/${id}`);
      alert("Project deleted");

      if (editingId === id) {
        setForm({ Project_name: "", Start_date: "", End_date: "", Budget: "" });
        setEditingId(null);
      }

      // Refresh projects list
      const res = await axios.get(`${API_URL}/projects`);
      setProjects(res.data);
    } catch (err) {
      alert("Failed to delete project");
      console.error(err);
    }
  };

  return (
    <div className="manage-projects-page">
      <div className="sidebar">
        <Sidebar />
      </div>

      <main className="manage-projects-main">
        <div className="form-wrapper">
          <h2 className="mg">Manage Projects</h2>

          <div className="form-group">
            <label htmlFor="Project_name">Project Name</label>
            <input
              type="text"
              id="Project_name"
              value={form.Project_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="Start_date">Start Date</label>
            <input
              type="date"
              id="Start_date"
              value={form.Start_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="End_date">End Date</label>
            <input
              type="date"
              id="End_date"
              value={form.End_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="Budget">Budget</label>
            <input
              type="number"
              step="0.01"
              id="Budget"
              value={form.Budget}
              onChange={handleChange}
            />
          </div>

          <button onClick={handleSave} disabled={!form.Project_name.trim()}>
            {editingId ? "Update Project" : "Save Project"}
          </button>

          <br />

          <h4 style={{ marginTop: "20px" }}>Project List</h4>
          <button onClick={() => setShowProjects(!showProjects)}>
            {showProjects ? "Hide Projects" : "Show Projects"}
          </button>

          {showProjects && (
            <div id="projectList">
              {projects.length === 0 ? (
                <p>No projects available</p>
              ) : (
                projects.map((proj) => (
                  <div className="project-item" key={proj.Project_ID}>
                    <strong>{proj.Project_name}</strong>
                    <br />
                    Start: {formatDate(proj.Start_date)} | End:{" "}
                    {formatDate(proj.End_date)} | Budget: $
                    {proj.Budget || "0.00"}
                    <div className="project-actions">
                      <button onClick={() => handleEdit(proj)}>Edit</button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(proj.Project_ID)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageProjects;
