import React, { useEffect, useState } from "react";
import "../styles/navbar.css";

const Navbar = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      document.body.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("darkMode", isDark);

    setDark(isDark);
  };

  return (
    <div className="navbar">

      {/* LOGO */}
      <h2 className="logo">Discipline<span>X</span></h2>

      {/* ACTIONS */}
      <div className="nav-actions">

        <button className="nav-btn" onClick={toggleDark}>
          {dark ? "☀️" : "🌙"}
        </button>

        <button
          className="nav-btn"
          onClick={() => window.location.href = "/analytics"}
        >
          📊 Analytics
        </button>

        <button
          className="nav-btn logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          🚪 Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;