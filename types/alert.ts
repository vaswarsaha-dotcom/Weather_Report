import type { AlertCondition } from "@/lib/constants";

export type { AlertCondition };

export interface AlertRecord {
  id: string;
  userId: string;
  label: string;
  lat: number;
  lon: number;
  placeName: string | null;
  condition: AlertCondition;
  threshold: number;
  active: boolean;
  lastTriggeredAt: string | null;
  createdAt: string;
}