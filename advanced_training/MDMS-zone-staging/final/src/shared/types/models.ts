// Data models shared by more than one feature. Shapes match db.json
// (see scripts/generate-db.mjs).

export type UserRole = "enterprise" | "zone_admin" | "customer";
export type UserStatus = "Active" | "Deactivated";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  zoneId: string | null;
  status: UserStatus;
  joinedOn: string;
  meterCount?: number; // customers only
}

export interface Zone {
  id: string;
  name: string;
  location: string;
  pincode: string;
  description: string;
  adminId: string;
  adminName: string;
  status: "Active" | "Deactivated";
  totalMeters: number;
  totalUsers: number;
}

export type MeterStatus = "Active" | "Pending" | "Deactivated";
export type TariffCategory = "Domestic" | "Commercial" | "Industrial";

export interface Meter {
  id: string;
  ownerId: string;
  ownerName: string;
  zoneId: string;
  zoneName: string;
  address: string;
  status: MeterStatus;
  lastReadingKwh: number | null;
  lastReadingAt: string | null;
  installedDate: string;
  tariffCategory: TariffCategory;
}

export interface MeterReading {
  id: string;
  meterId: string;
  zoneId: string;
  date: string; // YYYY-MM-DD
  readingKwh: number; // cumulative register at the end of the day
  consumptionKwh: number;
}

export type AlertSeverity = "Critical" | "Warning" | "Info";
export type AlertStatus = "Open" | "Acknowledged" | "Resolved";

export interface Alert {
  id: string;
  meterId: string;
  zoneId: string;
  zoneName: string;
  type: string;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  createdAt: string;
}
