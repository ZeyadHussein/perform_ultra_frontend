
import React, { useEffect, useState, useContext } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { FaBars } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faGooglePlus,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

import { ThemeContext } from "../context/ThemeContext";
import "../Styles/Feedback.css";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://perform-ultra-backend.vercel.app/api";

  useEffect(() => {
    if (!token) return;

    const fetchUserFeedback = async () => {
      try {
        const response = await axios.get(`${API_URL}/userfeedback`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchUserFeedback();
  }, [token, API_URL]);

  return (
    <>
      <div className={`feedback-page ${darkMode ? "dark-mode" : ""}`}>
        {/* Mobile Menu Toggle */}
        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars />
        </button>

        {/* Sidebar */}
        <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="content-container">
          <div className="feedback-content-wrapper">
            <div className="feedback-section">
              <h1 className="feedback-title">User Feedback</h1>

              <div className="feedback-container">
                {feedbacks.length > 0 ? (
                  feedbacks.map((feedback, index) => (
                    <div
                      key={feedback.feedback_ID || index}
                      className="feedback-card"
                    >
                      <div className="feedback-header">
                        <span className="feedback-role">USER</span>
                      </div>
                      <p className="feedback-text">{feedback.feedback_text}</p>
                      {index !== feedbacks.length - 1 && (
                        <hr className="feedback-divider" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="no-feedback">No feedback submitted yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="footerContain">
          <div className="socialIcons">
            {[faFacebook, faInstagram, faTwitter, faGooglePlus, faYoutube].map(
              (icon, i) => (
                <button key={i} onClick={() => console.log(icon.iconName)}>
                  <FontAwesomeIcon icon={icon} size="2x" />
                </button>
              ),
            )}
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
    </>
  );
};

export default Feedback;
