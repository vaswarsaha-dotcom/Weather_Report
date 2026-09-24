// app/api/history/route.ts

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createServiceClient,
} from "@/lib/supabase/server";

import {
  getSession,
} from "@/lib/auth";

interface OpenMeteoResponse {
  timezone?: string;

  minutely_15?: {
    time?: string[];
    temperature_2m?: number[];
    relative_humidity_2m?: number[];
  };

  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    relative_humidity_2m?: number[];
  };
}

export async function GET(
  request: NextRequest
) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        {
          snapshots: [],
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const daysParam =
      Number(searchParams.get("days")) || 1;

    const days = Math.min(
      Math.max(daysParam, 1),
      365
    );

    /*
     * -------------------------------------------------------
     * LOCATION
     * -------------------------------------------------------
     *
     * First use coordinates supplied by the HistoryChart.
     *
     * If none were supplied, use the user's latest snapshot.
     */
    let latitude = Number(
      searchParams.get("lat")
    );

    let longitude = Number(
      searchParams.get("lon")
    );

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      const supabase =
        createServiceClient();

      const {
        data: latest,
        error,
      } = await supabase
        .from("weather_snapshots")
        .select(
          "lat, lon, recorded_at"
        )
        .eq("user_id", user.id)
        .order("recorded_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          "HISTORY LOCATION ERROR:",
          error
        );

        return NextResponse.json(
          {
            snapshots: [],
            error:
              "Unable to find your weather location.",
          },
          { status: 500 }
        );
      }

      if (!latest) {
        return NextResponse.json({
          snapshots: [],
          error:
            "No weather location has been recorded for this account yet.",
        });
      }

      latitude = Number(
        latest.lat
      );

      longitude = Number(
        latest.lon
      );
    }

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return NextResponse.json(
        {
          snapshots: [],
          error:
            "Invalid weather coordinates.",
        },
        { status: 400 }
      );
    }

    /*
     * -------------------------------------------------------
     * OPEN-METEO
     * -------------------------------------------------------
     *
     * 24H:
     *   15-minute series -> dense chart
     *
     * 7D:
     *   hourly series
     *
     * 30D / ALL:
     *   hourly series, then reduced client-side/API-side
     */
    const url = new URL(
      "https://api.open-meteo.com/v1/forecast"
    );

    url.searchParams.set(
      "latitude",
      String(latitude)
    );

    url.searchParams.set(
      "longitude",
      String(longitude)
    );

    url.searchParams.set(
      "timezone",
      "auto"
    );

    url.searchParams.set(
      "temperature_unit",
      "celsius"
    );

    if (days === 1) {
      /*
       * Approximately 96 points.
       */
      url.searchParams.set(
        "minutely_15",
        "temperature_2m,relative_humidity_2m"
      );

      url.searchParams.set(
        "past_minutely_15",
        "96"
      );

      url.searchParams.set(
        "forecast_minutely_15",
        "1"
      );
    } else {
      /*
       * Longer ranges use hourly data.
       */
      url.searchParams.set(
        "hourly",
        "temperature_2m,relative_humidity_2m"
      );

      url.searchParams.set(
        "past_hours",
        String(
          Math.min(
            days * 24,
            2160
          )
        )
      );

      url.searchParams.set(
        "forecast_hours",
        "1"
      );
    }

    const response = await fetch(
      url.toString(),
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const text =
        await response.text();

      console.error(
        "OPEN METEO HISTORY ERROR:",
        text
      );

      return NextResponse.json(
        {
          snapshots: [],
          error:
            "Open-Meteo could not provide history.",
        },
        { status: 502 }
      );
    }

    const weather =
      (await response.json()) as OpenMeteoResponse;

    /*
     * -------------------------------------------------------
     * CONVERT OPEN-METEO DATA
     * -------------------------------------------------------
     */
    const output: Array<{
      id: string;
      user_id: string;
      lat: number;
      lon: number;
      temperature: number;
      humidity: number | null;
      recorded_at: string;
    }> = [];

    if (
      days === 1 &&
      weather.minutely_15
    ) {
      const times =
        weather.minutely_15.time ?? [];

      const temperatures =
        weather.minutely_15
          .temperature_2m ?? [];

      const humidity =
        weather.minutely_15
          .relative_humidity_2m ?? [];

      for (
        let i = 0;
        i < times.length;
        i++
      ) {
        const temperature =
          temperatures[i];

        if (
          typeof temperature !==
            "number" ||
          !Number.isFinite(
            temperature
          )
        ) {
          continue;
        }

        output.push({
          id: `open-meteo-${times[i]}`,
          user_id: user.id,
          lat: latitude,
          lon: longitude,
          temperature,
          humidity:
            typeof humidity[i] ===
              "number"
              ? humidity[i]
              : null,
          recorded_at:
            times[i],
        });
      }
    } else if (
      weather.hourly
    ) {
      const times =
        weather.hourly.time ?? [];

      const temperatures =
        weather.hourly
          .temperature_2m ?? [];

      const humidity =
        weather.hourly
          .relative_humidity_2m ?? [];

      for (
        let i = 0;
        i < times.length;
        i++
      ) {
        const temperature =
          temperatures[i];

        if (
          typeof temperature !==
            "number" ||
          !Number.isFinite(
            temperature
          )
        ) {
          continue;
        }

        output.push({
          id: `open-meteo-${times[i]}`,
          user_id: user.id,
          lat: latitude,
          lon: longitude,
          temperature,
          humidity:
            typeof humidity[i] ===
              "number"
              ? humidity[i]
              : null,
          recorded_at:
            times[i],
        });
      }
    }

    /*
     * -------------------------------------------------------
     * MERGE REAL USER SNAPSHOTS
     * -------------------------------------------------------
     */
    const supabase =
      createServiceClient();

    const since =
      new Date(
        Date.now() -
          days *
            24 *
            60 *
            60 *
            1000
      ).toISOString();

    const {
      data: saved,
    } = await supabase
      .from("weather_snapshots")
      .select(
        `
          id,
          user_id,
          lat,
          lon,
          temperature,
          humidity,
          recorded_at
        `
      )
      .eq("user_id", user.id)
      .gte(
        "recorded_at",
        since
      )
      .order("recorded_at", {
        ascending: true,
      })
      .limit(5000);

    /*
     * Open-Meteo is the background series.
     * User snapshots are preserved too.
     */
    const merged = [
      ...output,
      ...(saved ?? []),
    ];

    /*
     * Remove exact duplicate timestamps.
     */
    const unique =
      new Map<string, (typeof merged)[number]>();

    for (const item of merged) {
      if (!item) continue;

      const key =
        new Date(
          item.recorded_at
        ).toISOString();

      /*
       * Prefer user's actual saved
       * snapshot over generated/model data
       * when they have the same timestamp.
       */
      unique.set(key, item);
    }

    let result = Array.from(
      unique.values()
    ).sort(
      (a, b) =>
        new Date(
          a.recorded_at
        ).getTime() -
        new Date(
          b.recorded_at
        ).getTime()
    );

    /*
     * -------------------------------------------------------
     * LONG RANGE REDUCTION
     * -------------------------------------------------------
     */
    if (days === 7) {
      result = result.filter(
        (_, index) =>
          index % 3 === 0
      );
    }

    if (days === 30) {
      result = result.filter(
        (_, index) =>
          index % 6 === 0
      );
    }

    if (days > 30) {
      result = result.filter(
        (_, index) =>
          index % 12 === 0
      );
    }

    return NextResponse.json({
      snapshots: result,
      timezone:
        weather.timezone ??
        "auto",
      source: "open-meteo",
    });
  } catch (error) {
    console.error(
      "HISTORY API ERROR:",
      error
    );

    return NextResponse.json(
      {
        snapshots: [],
        error:
          "Failed to load weather history.",
      },
      { status: 500 }
    );
  }
}