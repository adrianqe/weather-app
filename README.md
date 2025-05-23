# 🌤️ Weather App - Technical Assessment

This is a full-stack weather application built as a technical assessment. The app allows users to input a location (city, zip code, etc.) and retrieve real-time weather data and a 5-day forecast. It also supports full CRUD operations to store and manage historical weather queries.

## 🔧 Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB (via Railway)
- **API:** OpenWeatherMap API

## ✨ Features

- ✅ Get current weather by city, zip code, or GPS
- ✅ View 5-day weather forecast
- ✅ Save weather queries to the database
- ✅ Edit or delete saved records (CRUD)
- ✅ Geolocation support
- ✅ Weather icons (via OpenWeather)
- ✅ Export saved queries to CSV or JSON
- ✅ Embedded Google Map for each saved location

## 📂 Project Structure

weather-app/

├── client/ # Frontend (React)

├── server/ # Backend (Express)

└── README.md # Project overview


## 🚀 Live Demo

- **Frontend:** [https://weather-app.vercel.app](https://weather-app-lilac-nine-92.vercel.app/)
- **Backend:** [https://weather-app.railway.app](https://railway.com/invite/24UKo_8jEsu)

---

## 🛠️ Setup Instructions

### 🔹 Frontend
```bash
cd client
npm install
npm run dev
```
### 🔹 Backend
cd server
npm install
node index.js

### 🔹 Environment Variables
Create a .env file in /server and add:
```bash
MONGODB_URI=your_mongo_uri
OPENWEATHER_API_KEY=your_openweather_key
```
### 📦 Optional Enhancements
- 🌍 Embedded Google Maps
- 📤 Export to CSV or JSON
- 🧪 Unit testing (Jest / React Testing Library)
