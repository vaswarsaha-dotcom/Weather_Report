import { NextResponse } from "next/server";

export async function GET(
  request: Request
) {
  const { searchParams } =
    new URL(request.url);

  const lat = Number(
    searchParams.get("lat")
  );

  const lon = Number(
    searchParams.get("lon")
  );

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon)
  ) {
    return NextResponse.json(
      {
        error:
          "lat and lon are required"
      },
      {
        status: 400
      }
    );
  }

  const url = new URL(
    "https://air-quality-api.open-meteo.com/v1/air-quality"
  );

  url.searchParams.set(
    "latitude",
    String(lat)
  );

  url.searchParams.set(
    "longitude",
    String(lon)
  );

  url.searchParams.set(
    "current",
    "us_aqi,pm2_5,pm10,ozone"
  );

  url.searchParams.set(
    "forecast_days",
    "1"
  );

  try {
    const response = await fetch(
      url.toString(),
      {
        next: {
          revalidate: 1800
        }
      }
    );

    if (!response.ok) {
      throw new Error(
        `Air quality request failed: ${response.status}`
      );
    }

    const data =
      await response.json();

    const current =
      data.current ?? {};

    const aqi = Number(
      current.us_aqi ?? 0
    );

    return NextResponse.json({
      aqi,
      pm2_5: Number(
        current.pm2_5 ?? 0
      ),
      pm10: Number(
        current.pm10 ?? 0
      ),
      ozone: Number(
        current.ozone ?? 0
      ),
      status: getAQIStatus(aqi)
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Unable to fetch air-quality data",
        detail:
          (error as Error).message
      },
      {
        status: 502
      }
    );
  }
}

function getAQIStatus(
  aqi: number
) {
  if (aqi <= 50) {
    return "Good";
  }

  if (aqi <= 100) {
    return "Moderate";
  }

  if (aqi <= 150) {
    return "Unhealthy for sensitive groups";
  }

  if (aqi <= 200) {
    return "Unhealthy";
  }

  if (aqi <= 300) {
    return "Very unhealthy";
  }

  return "Hazardous";
}