import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface FavoriteCity {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface BrandingSettings {
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  font: string;
  borderRadius: string;
  theme: "light" | "dark";
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  favoriteCities: FavoriteCity[];
  branding: BrandingSettings;
  createdAt: Date;
  lastLoginAt: Date | null;
}

const FavoriteCitySchema = new Schema<FavoriteCity>(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    country: { type: String, default: "" },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timezone: { type: String, default: "auto" }
  },
  { _id: false }
);

const BrandingSchema = new Schema<BrandingSettings>(
  {
    companyName: { type: String, default: "WeatherSphere Pro" },
    logoUrl: { type: String, default: "" },
    primaryColor: { type: String, default: "#F5A623" },
    font: { type: String, default: "Inter" },
    borderRadius: { type: String, default: "1rem" },
    theme: { type: String, enum: ["light", "dark"], default: "dark" }
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  favoriteCities: { type: [FavoriteCitySchema], default: [] },
  branding: { type: BrandingSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: null }
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
