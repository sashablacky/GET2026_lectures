import type { TariffCategory } from "../../../shared/types/models";

export interface ZoneSettings {
  id: string; // same as zoneId
  zoneId: string;
  thresholds: {
    highConsumptionKwh: number; // per meter per day
    lowConsumptionKwh: number; // per meter per day
    abnormalReadingsPerDay: number;
    inactiveMeterHours: number;
  };
  channels: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
}

export interface ZoneDailyConsumption {
  id: string;
  zoneId: string;
  date: string; // YYYY-MM-DD
  totalKwh: number;
  meterCount: number;
  avgKwhPerMeter: number;
}

// One point of a consumption chart
export interface ConsumptionPoint {
  label: string;
  kwh: number;
}

// Form values are kept as strings, the same as the inputs hold them.
export interface MeterFormValues {
  meterId: string;
  ownerId: string;
  address: string;
  tariffCategory: TariffCategory | "";
  installedDate: string;
}

export interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
}

export interface SettingsFormValues {
  highConsumptionKwh: string;
  lowConsumptionKwh: string;
  abnormalReadingsPerDay: string;
  inactiveMeterHours: string;
  email: boolean;
  sms: boolean;
  inApp: boolean;
}
