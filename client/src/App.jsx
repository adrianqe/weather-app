import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

const API_KEY = "885d8ab8a8776570cde1949506936b05";

function App() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  // Obtener clima por nombre o coords
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      // Clima actual
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const weatherData = await weatherRes.json();
      setWeather(weatherData);
      setLocation(weatherData.name);

      // Pronóstico 5 días
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();

      // Extraer solo un pronóstico por día (a mediodía)
      const dailyForecast = forecastData.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(dailyForecast);
      setError(null);
    } catch (err) {
      setError("Error fetching weather data");
      console.error(err);
    }
  };

  const exportData = async (format) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/export?format=${format}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `weather-data.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  // Obtener clima por ciudad escrita
  const fetchWeatherByCity = async (city) => {
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const weatherData = await weatherRes.json();
      if (weatherData.cod !== 200) {
        setError("City not found");
        setWeather(null);
        setForecast([]);
        return;
      }
      setWeather(weatherData);
      setLocation(weatherData.name);

      // Pronóstico
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();
      const dailyForecast = forecastData.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(dailyForecast);
      setError(null);
    } catch (err) {
      setError("Error fetching weather data");
      console.error(err);
    }
  };

  // Al cargar, pedir ubicación al navegador
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          setError("Permission denied for location");
        }
      );
    } else {
      setError("Geolocation not supported");
    }
  }, []);

  const handleSearch = () => {
    if (!location) return;
    fetchWeatherByCity(location);
  };

  return (
    <div className="App" style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>🌤️ Weather App</h1>

      <input
        type="text"
        placeholder="Enter city name..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ padding: "8px", width: "70%" }}
      />
      <button onClick={handleSearch} style={{ padding: "8px 12px", marginLeft: 8 }}>
        Search
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: 20 }}>
          <h2>
            {weather.name} ({weather.sys.country})
          </h2>
          <p style={{ fontSize: 24 }}>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              style={{ verticalAlign: "middle" }}
            />
            {Math.round(weather.main.temp)}°C - {weather.weather[0].description}
          </p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}

      {forecast.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>5-Day Forecast</h3>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {forecast.map((f) => (
              <div
                key={f.dt}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 10,
                  textAlign: "center",
                  width: "18%",
                }}
              >
                <p>{new Date(f.dt_txt).toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png`}
                  alt={f.weather[0].description}
                  style={{ width: 50, height: 50 }}
                />
                <p>{Math.round(f.main.temp)}°C</p>
                <p style={{ fontSize: 12 }}>{f.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {weather && weather.coord && (
        <div style={{ marginTop: 30 }}>
          <h3>📍 Map</h3>
          <MapContainer
            center={[weather.coord.lat, weather.coord.lon]}
            zoom={10}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[weather.coord.lat, weather.coord.lon]}>
              <Popup>{weather.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        <h3>📤 Export Data</h3>
        <button onClick={() => exportData("json")}>Export JSON</button>
        <button onClick={() => exportData("csv")} style={{ marginLeft: 10 }}>
          Export CSV
        </button>
      </div>

    </div>
  );
}

export default App;