"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import type {
  GeoResult,
  WeatherSnapshot
} from "@/types/weather";

const REFRESH_INTERVAL =
  5 * 60 * 1000;

export function useWeather(
  location: GeoResult | null
) {
  const [
    snapshot,
    setSnapshot
  ] = useState<WeatherSnapshot | null>(
    null
  );

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    error,
    setError
  ] = useState<string | null>(null);

  const [
    isOffline,
    setIsOffline
  ] = useState(false);

  const intervalRef =
    useRef<ReturnType<
      typeof setInterval
    > | null>(null);

  const fetchWeather =
    useCallback(
      async (
        currentLocation: GeoResult
      ) => {
        if (
          typeof navigator !==
            "undefined" &&
          !navigator.onLine
        ) {
          setIsOffline(true);
          setError(
            "You are currently offline."
          );
          return;
        }

        setLoading(true);
        setError(null);
        setIsOffline(false);

        try {
          const params =
            new URLSearchParams();

          params.set(
            "lat",
            String(
              currentLocation.latitude
            )
          );

          params.set(
            "lon",
            String(
              currentLocation.longitude
            )
          );

          params.set(
            "name",
            currentLocation.name
          );

          params.set(
            "country",
            currentLocation.country
          );

          params.set(
            "timezone",
            currentLocation.timezone ||
              "auto"
          );

          const response =
            await fetch(
              `/api/weather?${params.toString()}`,
              {
                cache: "no-store"
              }
            );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result.error ||
                "Failed to fetch weather."
            );
          }

          setSnapshot(
            result as WeatherSnapshot
          );
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Unable to load weather.";

          setError(message);
        } finally {
          setLoading(false);
        }
      },
      []
    );

  /*
   * LOAD WEATHER WHEN CITY CHANGES
   */
  useEffect(() => {
    if (!location) {
      setSnapshot(null);
      setError(null);
      return;
    }

    fetchWeather(location);

    if (intervalRef.current) {
      clearInterval(
        intervalRef.current
      );
    }

    intervalRef.current =
      setInterval(() => {
        fetchWeather(location);
      }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(
          intervalRef.current
        );

        intervalRef.current = null;
      }
    };
  }, [
    location,
    fetchWeather
  ]);

  /*
   * ONLINE / OFFLINE EVENTS
   */
  useEffect(() => {
    function handleOffline() {
      setIsOffline(true);
    }

    function handleOnline() {
      setIsOffline(false);

      if (location) {
        fetchWeather(location);
      }
    }

    window.addEventListener(
      "offline",
      handleOffline
    );

    window.addEventListener(
      "online",
      handleOnline
    );

    return () => {
      window.removeEventListener(
        "offline",
        handleOffline
      );

      window.removeEventListener(
        "online",
        handleOnline
      );
    };
  }, [
    location,
    fetchWeather
  ]);

  /*
   * MANUAL REFRESH
   */
  const refetch =
    useCallback(async () => {
      if (!location) {
        return;
      }

      await fetchWeather(location);
    }, [
      location,
      fetchWeather
    ]);

  return {
    snapshot,
    loading,
    error,
    isOffline,
    refetch
  };
}