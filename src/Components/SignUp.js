
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "../Styles/Signup.css";
import Link from "next/link";

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
    city: "",
    district: "",
    department_id: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        Name: formData.name.trim(),
        Email: formData.email.trim(),
        Password: formData.password,
        Role: formData.role,
        City: formData.city.trim(),
        District: formData.district.trim(),
        Department_ID: formData.department_id
          ? parseInt(formData.department_id)
          : null,
      };

      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      await axios.post(`${API_URL}/adduser`, payload);

      alert("✅ Signup successful! Redirecting...");
      router.push("/login");
    } catch (error) {
      console.error(
        "❌ Signup error:",
        error.response?.data?.message || error.message,
      );
      setError(
        error.response?.data?.message || "Signup failed. Please try again.",
      );
    }
  };

  return (
    <div className="signup-container">
      <img src="/Logooo-removebg-preview.png" alt="Logo" className="logo" />

      <h2>Sign Up</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
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

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </select>

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="district"
          placeholder="District"
          value={formData.district}
          onChange={handleChange}
        />
        <input
          type="number"
          name="department_id"
          placeholder="Department ID"
          value={formData.department_id}
          onChange={handleChange}
        />

        <button type="submit" className="signup-btn">
          Sign Up
        </button>
      </form>

      <p>
        Already have an account? <Link href="/login">Sign in here</Link>
      </p>

      <div className="social-login">
        <button className="google-btn">
          <img src="/Google.png" alt="Google" />
          Sign up with Google
        </button>
        <button className="apple-btn">
          <img src="/apple.png" alt="Apple" />
          Sign up with Apple
        </button>
      </div>
    </div>
  );
};

export default SignUp;
