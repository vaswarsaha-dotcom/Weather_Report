/**
 * WeatherSphere Pro — Embeddable Weather Widget
 *
 * Usage:
 *   <script
 *     src="https://yourapp.com/weather-widget.js"
 *     data-city="London"
 *     data-lat="51.5074"
 *     data-lon="-0.1278"
 *     data-timezone="Europe/London"
 *     data-color="#F5A623"
 *     data-font="Inter"
 *     data-radius="16"
 *     data-theme="dark"
 *     async
 *   ></script>
 *
 * The widget renders wherever this <script> tag sits in the DOM, fetches
 * live conditions from the WeatherSphere Pro API, and auto-refreshes every
 * 5 minutes. No build step, no framework — safe to drop into any site.
 */
(function () {
  var currentScript = document.currentScript;
  if (!currentScript) return;

  var cfg = {
    city: currentScript.getAttribute("data-city") || "Selected city",
    lat: currentScript.getAttribute("data-lat"),
    lon: currentScript.getAttribute("data-lon"),
    timezone: currentScript.getAttribute("data-timezone") || "auto",
    color: currentScript.getAttribute("data-color") || "#F5A623",
    font: currentScript.getAttribute("data-font") || "Inter, system-ui, sans-serif",
    radius: currentScript.getAttribute("data-radius") || "16",
    theme: currentScript.getAttribute("data-theme") || "dark",
    apiBase: currentScript.getAttribute("data-api-base") || new URL(currentScript.src).origin
  };

  if (!cfg.lat || !cfg.lon) {
    console.error("[WeatherSphere Widget] data-lat and data-lon are required.");
    return;
  }

  var isDark = cfg.theme === "dark";
  var palette = {
    bg: isDark ? "#161F38" : "#FFFFFF",
    text: isDark ? "#F4F6FA" : "#161F38",
    muted: isDark ? "#7C89A6" : "#4B5773",
    border: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"
  };

  var container = document.createElement("div");
  container.style.cssText =
    "font-family:" + cfg.font + ";background:" + palette.bg + ";color:" + palette.text +
    ";border:1px solid " + palette.border + ";border-radius:" + cfg.radius +
    "px;padding:20px;max-width:280px;box-shadow:0 8px 24px rgba(0,0,0,0.12);";
  container.setAttribute("role", "region");
  container.setAttribute("aria-label", "Weather widget for " + cfg.city);
  container.innerHTML = '<p style="margin:0;font-size:13px;color:' + palette.muted + '">Loading weather…</p>';

  currentScript.parentNode.insertBefore(container, currentScript.nextSibling);

  var WEATHER_CODE_LABELS = {
    0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Fog", 51: "Light drizzle", 53: "Drizzle", 55: "Dense drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow",
    75: "Heavy snow", 80: "Rain showers", 81: "Showers", 82: "Violent showers",
    95: "Thunderstorm", 96: "Thunderstorm", 99: "Severe thunderstorm"
  };

  function render(data) {
    var c = data.current;
    var label = WEATHER_CODE_LABELS[c.weatherCode] || "—";
    container.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
        '<span style="font-size:13px;font-weight:600">' + cfg.city + "</span>" +
        '<span style="width:10px;height:10px;border-radius:999px;background:' + cfg.color + '"></span>' +
      "</div>" +
      '<div style="font-size:36px;font-weight:600;line-height:1">' + Math.round(c.temperature) + "°</div>" +
      '<div style="font-size:13px;color:' + palette.muted + ';margin-top:4px">' +
        "Feels like " + Math.round(c.feelsLike) + "° · " + label +
      "</div>" +
      '<div style="display:flex;gap:16px;margin-top:14px;font-size:12px;color:' + palette.muted + '">' +
        "<span>💧 " + c.humidity + "%</span>" +
        "<span>💨 " + Math.round(c.windSpeed) + " km/h</span>" +
      "</div>" +
      '<div style="margin-top:12px;font-size:10px;color:' + palette.muted + ';text-align:right">' +
        "Powered by WeatherSphere Pro" +
      "</div>";
  }

  function renderError() {
    container.innerHTML =
      '<p style="margin:0;font-size:13px;color:' + palette.muted + '">Weather data unavailable right now.</p>';
  }

  function fetchWeather() {
    var url = cfg.apiBase + "/api/weather?lat=" + encodeURIComponent(cfg.lat) +
      "&lon=" + encodeURIComponent(cfg.lon) + "&name=" + encodeURIComponent(cfg.city) +
      "&timezone=" + encodeURIComponent(cfg.timezone);

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then(render)
      .catch(renderError);
  }

  fetchWeather();
  setInterval(fetchWeather, 5 * 60 * 1000);
})();
