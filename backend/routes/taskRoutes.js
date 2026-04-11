const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");


// ✅ ADD TASK (with date support)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { title, category, date } = req.body;

    const task = new Task({
      userId: req.user.id,
      title,
      category,
      date: date ? new Date(date) : new Date()
    });

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error adding task" });
  }
});


// ✅ GET STREAK (with unique dates)
router.get("/streak", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user.id,
      completed: true
    }).sort({ date: -1 });

    const dates = tasks.map(t =>
      new Date(t.date).toDateString()
    );

    const uniqueDates = [...new Set(dates)];

    let streak = 0;
    let today = new Date();

    for (let i = 0; i < uniqueDates.length; i++) {
      const taskDate = new Date(uniqueDates[i]);

      const diff = Math.floor(
        (today - taskDate) / (1000 * 60 * 60 * 24)
      );

      if (diff === i) {
        streak++;
      } else {
        break;
      }
    }

    res.json({
      streak,
      dates: uniqueDates.slice(0, 7)
    });

  } catch (err) {
    res.status(500).json({ error: "Error calculating streak" });
  }
});


// ✅ GET TASKS BY DATE (NEW FEATURE 🔥)
router.get("/by-date", authMiddleware, async (req, res) => {
  try {
    const { date } = req.query;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end }
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Error fetching tasks by date" });
  }
});


// ✅ GET ALL TASKS (history)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});


// ✅ TOGGLE TASK
router.put("/toggle/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Error updating task" });
  }
});

// ✅ DELETE TASK
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

module.exports = router;