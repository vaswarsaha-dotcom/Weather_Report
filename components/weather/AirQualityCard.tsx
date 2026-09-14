import { Wind } from "lucide-react";

interface AirQualityData {
  aqi: number;
  pm2_5: number;
  pm10: number;
  ozone: number;
  status: string;
}

export function AirQualityCard({
  data
}: {
  data: AirQualityData | null;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-glass backdrop-blur-xl">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
            Air quality
          </p>

          <h2 className="mt-1 font-display text-2xl text-cloud">
            {data
              ? `AQI ${Math.round(data.aqi)}`
              : "Air quality"}
          </h2>

        </div>

        <Wind className="h-6 w-6 text-cyan" />

      </div>

      {!data ? (
        <p className="mt-6 text-sm leading-6 text-slate">
          Air-quality information is
          temporarily unavailable.
        </p>
      ) : (
        <>
          <p className="mt-3 text-sm text-slate">
            {data.status}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">

            <Metric
              label="PM2.5"
              value={`${data.pm2_5.toFixed(
                1
              )} μg/m³`}
            />

            <Metric
              label="PM10"
              value={`${data.pm10.toFixed(
                1
              )} μg/m³`}
            />

            <Metric
              label="Ozone"
              value={`${data.ozone.toFixed(
                1
              )} μg/m³`}
            />

          </div>
        </>
      )}

    </section>
  );
}

function Metric({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-black/10 p-3">

      <p className="text-[11px] text-slate">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-cloud">
        {value}
      </p>

    </div>
  );
}