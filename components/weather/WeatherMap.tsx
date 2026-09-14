"use client";

import "leaflet/dist/leaflet.css";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  ZoomControl
} from "react-leaflet";

import type {
  GeoResult,
  WeatherSnapshot
} from "@/types/weather";

interface Props {
  location: GeoResult;
  snapshot: WeatherSnapshot;
}

export default function WeatherMap({
  location,
  snapshot
}: Props) {
  return (
    <MapContainer
      center={[
        location.latitude,
        location.longitude
      ]}
      zoom={9}
      scrollWheelZoom
      zoomControl={false}
      className="h-full min-h-[360px] w-full"
    >

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ZoomControl position="bottomright" />

      <CircleMarker
        center={[
          location.latitude,
          location.longitude
        ]}
        radius={12}
        pathOptions={{
          color: "#35c5e0",
          fillColor: "#35c5e0",
          fillOpacity: 0.75
        }}
      >

        <Popup>

          <strong>
            {location.name}
          </strong>

          <br />

          {Math.round(
            snapshot.current.temperature
          )}
          ° ·{" "}
          {snapshot.current.humidity}
          % humidity

        </Popup>

      </CircleMarker>

    </MapContainer>
  );
}