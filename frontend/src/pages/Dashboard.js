import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/global.css";
import "../styles/dashboard.css";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [streak, setStreak] = useState(0);
  const [streakDates, setStreakDates] = useState([]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // ✅ DELETE TASK (with confirmation)
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await API.delete(`/tasks/delete/${id}`);
      fetchTasks();
      fetchStreak();
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch tasks by date
  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/by-date?date=${selectedDate}`);
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch streak
  const fetchStreak = async () => {
    try {
      const res = await API.get("/tasks/streak");
      setStreak(res.data.streak);
      setStreakDates(res.data.dates || []);
    } catch (err) {
      console.log(err);
    }
  };

  // Add task
  const addTask = async () => {
    if (!title.trim()) return;

    try {
      await API.post("/tasks/add", {
        title,
        category: "coding",
        date: selectedDate
      });

      setTitle("");
      fetchTasks();
      fetchStreak();
    } catch (err) {
      console.log(err);
    }
  };

  // Toggle task
  const toggleTask = async (id) => {
    try {
      await API.put(`/tasks/toggle/${id}`);
      fetchTasks();
      fetchStreak();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStreak();
  }, [selectedDate]);

  const completed = tasks.filter((t) => t.completed).length;
  const progress =
    tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <>
      <Navbar />

      <div className="dashboard-container">

        {/* LEFT SIDE */}
        <div className="sidebar">

          {/* STREAK */}
          <motion.div
            className="stat-card"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="stat-title">🔥 Current Streak</div>
            <div className="stat-value">{streak} days</div>

            <div style={{ marginTop: "10px" }}>
              {streakDates.length === 0 && (
                <p style={{ fontSize: "12px", opacity: 0.6 }}>
                  No recent activity
                </p>
              )}

              {streakDates.map((d, i) => (
                <div key={i} style={{ fontSize: "12px", opacity: 0.7 }}>
                  {d}
                </div>
              ))}
            </div>
          </motion.div>

          {/* PROGRESS */}
          <motion.div
            className="stat-card"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="stat-title">📊 Progress</div>
            <div className="stat-value">{progress}%</div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>

        </div>

        {/* RIGHT SIDE */}
        <div className="main-content">

          {/* DATE NAVIGATION */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <button onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - 1);
              setSelectedDate(d.toISOString().split("T")[0]);
            }}>
              ← Prev
            </button>

            <button onClick={() => {
              setSelectedDate(new Date().toISOString().split("T")[0]);
            }}>
              Today
            </button>

            <button onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() + 1);
              setSelectedDate(d.toISOString().split("T")[0]);
            }}>
              Next →
            </button>
          </div>

          {/* ADD TASK */}
          <div className="card">
            <h3>Add Task ({selectedDate})</h3>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ marginBottom: "10px" }}
            />

            <div className="add-task">
              <input
                placeholder="What will you complete?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <button onClick={addTask}>Add</button>
            </div>
          </div>

          {/* TASK LIST */}
          <div className="card">
            <h3>Tasks for {selectedDate}</h3>

            <div className="task-list">
              {tasks.length === 0 && (
                <p style={{ opacity: 0.6 }}>
                  No tasks for this day
                </p>
              )}

              {tasks.map((t) => (
                <motion.div
                  key={t._id}
                  className="task-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span
                    className={`task-title ${
                      t.completed ? "task-completed" : ""
                    }`}
                  >
                    {t.title}
                  </span>

                  {/* ✅ BUTTON GROUP */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="task-btn"
                      onClick={() => toggleTask(t._id)}
                    >
                      {t.completed ? "Undo" : "Done"}
                    </button>

                    <button
                        className="delete-btn"
                        onClick={() => deleteTask(t._id)}>
                        Delete
                    </button>
                  </div>

                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;