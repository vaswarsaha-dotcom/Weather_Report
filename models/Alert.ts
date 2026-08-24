import mongoose, { Schema, type Document, type Model } from "mongoose";

export type AlertType = "rain" | "heat" | "wind" | "aqi";

export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId;
  type: AlertType;
  cityName: string;
  latitude: number;
  longitude: number;
  threshold: number;
  active: boolean;
  lastTriggeredAt: Date | null;
  createdAt: Date;
}

const AlertSchema = new Schema<IAlert>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, enum: ["rain", "heat", "wind", "aqi"], required: true },
  cityName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  threshold: { type: Number, required: true },
  active: { type: Boolean, default: true },
  lastTriggeredAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

export const AlertModel: Model<IAlert> = mongoose.models.Alert || mongoose.model<IAlert>("Alert", AlertSchema);

/** Sensible default thresholds shown in the alert-creation UI. */
export const ALERT_DEFAULTS: Record<AlertType, { label: string; unit: string; defaultThreshold: number }> = {
  rain: { label: "Rain Alert", unit: "mm/h", defaultThreshold: 2 },
  heat: { label: "Heat Alert", unit: "°C", defaultThreshold: 35 },
  wind: { label: "Wind Alert", unit: "km/h", defaultThreshold: 40 },
  aqi: { label: "AQI Alert", unit: "AQI", defaultThreshold: 150 }
};
