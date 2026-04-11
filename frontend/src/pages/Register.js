import React, { useState } from "react";
import API from "../services/api";
import "../styles/global.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", form);
      alert("Registered successfully");
      window.location.href = "/";
    } catch (err) {
      alert("Error registering");
      console.log(err);
    }
  };

  return (
    <div className="container" style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div className="card" style={{ width: "350px" }}>
        <h2 style={{ marginBottom: "20px" }}>Register</h2>

        <input
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleRegister}
          style={{ width: "100%" }}
        >
          Register
        </button>

        <p style={{ marginTop: "10px" }}>
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;