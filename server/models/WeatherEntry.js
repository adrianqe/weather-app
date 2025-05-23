// server/models/WeatherEntry.js
const mongoose = require("mongoose");

const WeatherEntrySchema = new mongoose.Schema({
    location: String,
    dateRange: {
        start: Date,
        end: Date,
    },
    weatherData: Object,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("WeatherEntry", WeatherEntrySchema);
