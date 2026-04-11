import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/global.css";
import "../styles/analytics.css";
import { motion } from "framer-motion";

const Analytics = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const recent = tasks.slice(0, 7);

  return (
    <>
      <Navbar />

      <motion.div
        className="analytics-container"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* HEADER */}
        <h2 className="analytics-title">
          📊 Analytics Overview
        </h2>

        {/* STATS */}
        <div className="analytics-grid">

          <motion.div className="analytics-card" whileHover={{ scale: 1.03 }}>
            <h4>Total Tasks</h4>
            <h1>{total}</h1>
          </motion.div>

          <motion.div className="analytics-card" whileHover={{ scale: 1.03 }}>
            <h4>Completed</h4>
            <h1>{completed}</h1>
          </motion.div>

          <motion.div className="analytics-card" whileHover={{ scale: 1.03 }}>
            <h4>Pending</h4>
            <h1>{pending}</h1>
          </motion.div>

          <motion.div className="analytics-card" whileHover={{ scale: 1.03 }}>
            <h4>Progress</h4>
            <h1>{progress}%</h1>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>

        </div>

        {/* RECENT ACTIVITY */}
        <motion.div
          className="analytics-card full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3>Recent Activity</h3>

          {recent.length === 0 && <p>No activity yet</p>}

          {recent.map((t) => (
            <div key={t._id} className="activity-item">
              <span className={t.completed ? "done" : ""}>
                {t.title}
              </span>
              <small>
                {new Date(t.date).toDateString()}
              </small>
            </div>
          ))}
        </motion.div>

      </motion.div>
    </>
  );
};

export default Analytics;