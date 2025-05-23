// server/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const WeatherEntry = require("./models/WeatherEntry");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
    res.send("Weather API backend is running 🚀");
});

// Ready to add more routes here (CRUD, weather fetch, etc.)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// CREATE
app.post("/weather", async (req, res) => {
    const { location, dateRange, weatherData } = req.body;

    if (!location || !dateRange?.start || !dateRange?.end) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const newEntry = new WeatherEntry({ location, dateRange, weatherData });
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (err) {
        res.status(500).json({ error: "Failed to save entry" });
    }
});

// READ ALL
app.get("/weather", async (req, res) => {
    try {
        const entries = await WeatherEntry.find().sort({ createdAt: -1 });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch entries" });
    }
});

// UPDATE
app.put("/weather/:id", async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updated = await WeatherEntry.findByIdAndUpdate(id, updates, { new: true });
        if (!updated) return res.status(404).json({ error: "Entry not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update entry" });
    }
});

// DELETE
app.delete("/weather/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await WeatherEntry.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "Entry not found" });
        res.json({ message: "Entry deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete entry" });
    }
});

app.get("/export", async (req, res) => {
    const format = req.query.format;
    const entries = await collection.find().toArray();

    if (format === "json") {
        res.setHeader("Content-Disposition", "attachment; filename=weather.json");
        res.setHeader("Content-Type", "application/json");
        return res.send(JSON.stringify(entries, null, 2));
    }

    if (format === "csv") {
        const fields = ["location", "createdAt", "weather.temp", "weather.description"];
        const csv = entries.map((entry) =>
            `${entry.location},${entry.createdAt},${entry.weather?.temp || ""},${entry.weather?.description || ""}`
        );
        const output = ["Location,Created At,Temp,Description", ...csv].join("\n");

        res.setHeader("Content-Disposition", "attachment; filename=weather.csv");
        res.setHeader("Content-Type", "text/csv");
        return res.send(output);
    }

    res.status(400).send("Invalid format");
});

// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));