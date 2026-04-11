import React, { useState } from "react";
import API from "../services/api";
import "../styles/global.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container" style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ width: "350px" }}>
        <h2 style={{ marginBottom: "20px" }}>Login</h2>

        <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button onClick={handleLogin} style={{ width: "100%" }}>Login</button>

        <p style={{ marginTop: "10px" }}>
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;