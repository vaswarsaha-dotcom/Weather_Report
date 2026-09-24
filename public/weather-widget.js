(function () {
  "use strict";

  /* =========================================================
     GET THE SCRIPT THAT LOADED THIS WIDGET
  ========================================================= */

  var scriptTag = document.currentScript;

  if (!scriptTag) {
    return;
  }

  /* =========================================================
     WIDGET SETTINGS
  ========================================================= */

  var lat = scriptTag.getAttribute("data-lat");
  var lon = scriptTag.getAttribute("data-lon");
  var theme =
    scriptTag.getAttribute("data-theme") || "dark";

  /* =========================================================
     WEATHERSPHERE ORIGIN
  ========================================================= */

  var origin = new URL(
    scriptTag.src,
    window.location.href
  ).origin;

  /* =========================================================
     ESCAPE HTML
  ========================================================= */

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =========================================================
     CREATE ELEMENT
  ========================================================= */

  function createElement(
    tag,
    styles,
    text
  ) {
    var element = document.createElement(tag);

    if (styles) {
      Object.keys(styles).forEach(function (key) {
        element.style[key] = styles[key];
      });
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  }

  /* =========================================================
     RENDER WIDGET
  ========================================================= */

  function render(target) {
    if (!target) {
      return;
    }

    if (!lat || !lon) {
      target.textContent =
        "Invalid widget coordinates";

      target.style.fontFamily =
        "Arial, Helvetica, sans-serif";

      target.style.color = "#999";

      return;
    }

    /* =======================================================
       COLORS
    ======================================================= */

    var isDark = theme === "dark";

    var bg = isDark
      ? "#11182D"
      : "#FFFFFF";

    var fg = isDark
      ? "#F5F7FB"
      : "#111827";

    var sub = isDark
      ? "#8793AF"
      : "#64748B";

    var border = isDark
      ? "rgba(255,255,255,0.09)"
      : "rgba(15,23,42,0.10)";

    var brand = "#F5B942";

    /* =======================================================
       CLEAR OLD CONTENT
    ======================================================= */

    target.innerHTML = "";

    /* =======================================================
       LOADING
    ======================================================= */

    var loadingCard = createElement(
      "div",
      {
        fontFamily:
          "Arial, Helvetica, sans-serif",
        background: bg,
        color: fg,
        borderRadius: "18px",
        padding: "20px",
        width: "270px",
        boxSizing: "border-box",
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.18)",
        border:
          "1px solid " + border
      }
    );

    var loadingText = createElement(
      "div",
      {
        fontSize: "13px",
        color: sub
      },
      "Loading weather..."
    );

    loadingCard.appendChild(
      loadingText
    );

    target.appendChild(
      loadingCard
    );

    /* =======================================================
       API URL

       Your API accepts:
       lat
       lon
       name
       country
       timezone
    ======================================================= */

    var apiUrl =
      origin +
      "/api/weather" +
      "?lat=" +
      encodeURIComponent(lat) +
      "&lon=" +
      encodeURIComponent(lon) +
      "&name=" +
      encodeURIComponent("Kolkata") +
      "&country=" +
      encodeURIComponent("India") +
      "&timezone=auto";

    /* =======================================================
       FETCH WEATHER
    ======================================================= */

    fetch(apiUrl, {
      cache: "no-store"
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error(
            "Weather request failed"
          );
        }

        return response.json();
      })

      .then(function (data) {
        /* ===================================================
           YOUR API RETURNS:

           data.location.name
           data.location.country

           data.current.temperature
           data.current.feelsLike
           data.current.humidity
           data.current.windSpeed
        =================================================== */

        if (
          !data ||
          !data.current
        ) {
          throw new Error(
            "Invalid weather response"
          );
        }

        var current =
          data.current;

        var locationName =
          data.location &&
          data.location.name
            ? data.location.name
            : lat + ", " + lon;

        var country =
          data.location &&
          data.location.country
            ? data.location.country
            : "";

        var temperature =
          typeof current.temperature ===
          "number"
            ? Math.round(
                current.temperature
              )
            : "--";

        var feelsLike =
          typeof current.feelsLike ===
          "number"
            ? Math.round(
                current.feelsLike
              )
            : "--";

        var humidity =
          typeof current.humidity ===
          "number"
            ? Math.round(
                current.humidity
              )
            : "--";

        var windSpeed =
          typeof current.windSpeed ===
          "number"
            ? Math.round(
                current.windSpeed
              )
            : "--";

        /* ===================================================
           CLEAR LOADING
        =================================================== */

        target.innerHTML = "";

        /* ===================================================
           MAIN CARD
        =================================================== */

        var card = createElement(
          "div",
          {
            fontFamily:
              "Arial, Helvetica, sans-serif",

            background: bg,

            color: fg,

            borderRadius: "18px",

            padding: "18px",

            width: "270px",

            boxSizing: "border-box",

            boxShadow:
              "0 10px 30px rgba(0,0,0,0.18)",

            border:
              "1px solid " + border
          }
        );

        /* ===================================================
           BRAND HEADER
        =================================================== */

        var header = createElement(
          "div",
          {
            display: "flex",

            alignItems: "center",

            justifyContent:
              "space-between",

            marginBottom: "17px"
          }
        );

        /* Brand left side */

        var brandContainer =
          createElement(
            "div",
            {
              display: "flex",

              alignItems: "center",

              gap: "8px"
            }
          );

        /* ===================================================
           WEATHERSPHERE LOGO
        =================================================== */

        var logo = createElement(
          "div",
          {
            width: "28px",

            height: "28px",

            borderRadius: "9px",

            background: brand,

            display: "flex",

            alignItems: "center",

            justifyContent:
              "center",

            fontSize: "15px",

            fontWeight: "800",

            color: "#111827"
          },
          "W"
        );

        brandContainer.appendChild(
          logo
        );

        /* ===================================================
           BRAND TEXT
        =================================================== */

        var brandText =
          createElement(
            "div"
          );

        var brandName =
          createElement(
            "div",
            {
              fontSize: "13px",

              fontWeight: "700",

              lineHeight: "1.1"
            },
            "WeatherSphere"
          );

        var brandSubtitle =
          createElement(
            "div",
            {
              fontSize: "9px",

              color: sub,

              marginTop: "2px"
            },
            "Weather Widget"
          );

        brandText.appendChild(
          brandName
        );

        brandText.appendChild(
          brandSubtitle
        );

        brandContainer.appendChild(
          brandText
        );

        header.appendChild(
          brandContainer
        );

        /* ===================================================
           LIVE DOT
        =================================================== */

        var liveDot =
          createElement(
            "div",
            {
              width: "7px",

              height: "7px",

              borderRadius: "50%",

              background: "#35D07F"
            }
          );

        header.appendChild(
          liveDot
        );

        card.appendChild(
          header
        );

        /* ===================================================
           LOCATION
        =================================================== */

        var location =
          createElement(
            "div",
            {
              fontSize: "12px",

              color: sub,

              marginBottom: "4px",

              overflow: "hidden",

              whiteSpace: "nowrap",

              textOverflow:
                "ellipsis"
            },
            locationName +
              (country
                ? ", " + country
                : "")
          );

        card.appendChild(
          location
        );

        /* ===================================================
           TEMPERATURE ROW
        =================================================== */

        var temperatureRow =
          createElement(
            "div",
            {
              display: "flex",

              alignItems:
                "flex-start",

              gap: "3px"
            }
          );

        var temperatureText =
          createElement(
            "span",
            {
              fontSize: "42px",

              lineHeight: "1",

              fontWeight: "700",

              letterSpacing:
                "-2px"
            },
            String(temperature)
          );

        var degree =
          createElement(
            "span",
            {
              fontSize: "18px",

              fontWeight: "600",

              marginTop: "3px"
            },
            "°C"
          );

        temperatureRow.appendChild(
          temperatureText
        );

        temperatureRow.appendChild(
          degree
        );

        card.appendChild(
          temperatureRow
        );

        /* ===================================================
           FEELS LIKE
        =================================================== */

        var feels =
          createElement(
            "div",
            {
              fontSize: "11px",

              color: sub,

              marginTop: "7px"
            },
            "Feels like " +
              feelsLike +
              "°C"
          );

        card.appendChild(
          feels
        );

        /* ===================================================
           DETAILS
        =================================================== */

        var details =
          createElement(
            "div",
            {
              display: "flex",

              gap: "18px",

              marginTop: "16px",

              fontSize: "11px",

              color: sub
            }
          );

        var humidityText =
          createElement(
            "span",
            null,
            "💧 " +
              humidity +
              "%"
          );

        var windText =
          createElement(
            "span",
            null,
            "💨 " +
              windSpeed +
              " km/h"
          );

        details.appendChild(
          humidityText
        );

        details.appendChild(
          windText
        );

        card.appendChild(
          details
        );

        /* ===================================================
           FOOTER
        =================================================== */

        var footer =
          createElement(
            "div",
            {
              marginTop: "17px",

              paddingTop: "11px",

              borderTop:
                "1px solid " +
                border,

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between"
            }
          );

        var liveText =
          createElement(
            "span",
            {
              fontSize: "9px",

              color: sub
            },
            "Live weather"
          );

        var brandLink =
          createElement(
            "a",
            {
              fontSize: "10px",

              color: brand,

              fontWeight: "700",

              textDecoration:
                "none"
            },
            "WeatherSphere ↗"
          );

        brandLink.href =
          origin;

        brandLink.target =
          "_blank";

        brandLink.rel =
          "noopener noreferrer";

        footer.appendChild(
          liveText
        );

        footer.appendChild(
          brandLink
        );

        card.appendChild(
          footer
        );

        /* ===================================================
           ADD CARD
        =================================================== */

        target.appendChild(
          card
        );
      })

      /* =====================================================
         ERROR
      ===================================================== */

      .catch(function () {
        target.innerHTML = "";

        var errorCard =
          createElement(
            "div",
            {
              fontFamily:
                "Arial, Helvetica, sans-serif",

              background:
                isDark
                  ? "#11182D"
                  : "#FFFFFF",

              color:
                isDark
                  ? "#F5F7FB"
                  : "#111827",

              borderRadius:
                "18px",

              padding: "20px",

              width: "270px",

              boxSizing:
                "border-box",

              border:
                "1px solid " +
                border
            }
          );

        var errorText =
          createElement(
            "div",
            {
              fontSize: "13px",

              color: "#F87171"
            },
            "Forecast unavailable"
          );

        errorCard.appendChild(
          errorText
        );

        target.appendChild(
          errorCard
        );
      });
  }

  /* =========================================================
     START WIDGET
  ========================================================= */

  function start() {
    var target =
      document.getElementById(
        "weathersphere-widget"
      );

    if (target) {
      render(target);
    }
  }

  /* =========================================================
     HANDLE SCRIPT LOADING
  ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      start
    );
  } else {
    start();
  }
})();