// public/weather-widget.js
(function () {
  var scriptTag = document.currentScript;
  var lat = scriptTag.getAttribute("data-lat");
  var lon = scriptTag.getAttribute("data-lon");
  var theme = scriptTag.getAttribute("data-theme") || "dark";
  var origin = new URL(scriptTag.src).origin;

  function render(target) {
    fetch(origin + "/api/weather?lat=" + lat + "&lon=" + lon)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var w = data.weather;
        if (!w) { target.innerHTML = '<div style="font:13px sans-serif;color:#999;">Forecast unavailable</div>'; return; }
        var isDark = theme === "dark";
        var bg = isDark ? "#161F38" : "#FFFFFF";
        var fg = isDark ? "#F4F6FA" : "#0D1321";
        var sub = isDark ? "#7C89A6" : "#4B5773";
        target.innerHTML =
          '<div style="font-family:sans-serif;background:' + bg + ';color:' + fg +
          ';border-radius:14px;padding:16px 18px;width:220px;box-shadow:0 4px 20px rgba(0,0,0,0.15);">' +
          '<div style="font-size:12px;color:' + sub + ';margin-bottom:4px;">' + w.placeName + '</div>' +
          '<div style="font-size:32px;font-weight:700;">' + Math.round(w.current.temperature) + '°C</div>' +
          '<div style="font-size:12px;color:' + sub + ';margin-top:2px;">Feels like ' + Math.round(w.current.apparentTemperature) + '°C</div>' +
          '<div style="font-size:10px;color:' + sub + ';margin-top:10px;">Powered by ' + window.location.hostname + '</div>' +
          '</div>';
      })
      .catch(function () { target.innerHTML = '<div style="font:13px sans-serif;color:#999;">Forecast unavailable</div>'; });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var target = document.getElementById("weathersphere-widget");
    if (target && lat && lon) render(target);
  });
})();