import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Login.css";
import jwt_decode from "jwt-decode"; // fixed import

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Use environment variable for backend URL
  const API_URL = process.env.REACT_APP_API_URL || "https://perform-ultra-backend.vercel.app/api";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      const response = await axios.post(`${API_URL}/login`, {
        Email: formData.email,
        Password: formData.password,
      });

      if (response.status === 200) {
        const { token, user } = response.data; // Get token and user data
        const decodedToken = jwt_decode(token); // Decode JWT token to get user info
        console.log("Decoded Token:", decodedToken);

        localStorage.setItem("userId", decodedToken.id); // Store user ID
        localStorage.setItem("token", token); // Store JWT token
        localStorage.setItem("user", JSON.stringify(user)); // Store user info

        navigate("/HomePage"); // Redirect after successful login
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    }
  };

  return (
    <div className="signup-container">
      <img src="../../public/Logooo-removebg-preview.png" alt="Perform Ultra logo featuring purple and blue geometric shapes" className="logo" />
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="signup-btn">
          Login
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
      <div className="social-login">
        <button className="google-btn">
          <img src="../../public/Google.png" alt="Google logo" />
          Sign in with Google
        </button>
        <button className="apple-btn">
          <img src="../../public/apple.png" alt="Apple logo" />
          Sign in with Apple
        </button>
      </div>
    </div>
  );
};

export default Login;
