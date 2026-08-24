import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IWeatherSnapshot extends Document {
  userId: mongoose.Types.ObjectId;
  cityName: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  weatherCode: number;
  recordedAt: Date;
}

const WeatherSnapshotSchema = new Schema<IWeatherSnapshot>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  cityName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  windSpeed: { type: Number, required: true },
  pressure: { type: Number, required: true },
  weatherCode: { type: Number, required: true },
  recordedAt: { type: Date, default: Date.now, index: true }
});

// Compound index for the dashboard's "history for this city, this range" query.
WeatherSnapshotSchema.index({ userId: 1, latitude: 1, longitude: 1, recordedAt: -1 });

export const WeatherSnapshotModel: Model<IWeatherSnapshot> =
  mongoose.models.WeatherSnapshot || mongoose.model<IWeatherSnapshot>("WeatherSnapshot", WeatherSnapshotSchema);
