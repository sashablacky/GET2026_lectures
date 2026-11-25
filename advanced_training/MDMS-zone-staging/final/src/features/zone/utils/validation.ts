import type { FormErrors } from "../../../shared/hooks/useForm";
import type { CustomerFormValues, MeterFormValues, SettingsFormValues } from "../types/zone";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Indian mobile: optional +91, then 10 digits starting with 6-9
const PHONE_RE = /^(\+91[\s-]?)?[6-9]\d{9}$/;
const METER_ID_RE = /^M-\d{4,}$/;
const NAME_RE = /^[A-Za-z][A-Za-z .'-]*$/;

const today = () => new Date().toISOString().slice(0, 10);

export function validateMeterForm(v: MeterFormValues): FormErrors<MeterFormValues> {
  const errors: FormErrors<MeterFormValues> = {};
  const id = v.meterId.trim();
  if (!id) errors.meterId = "Meter ID is required.";
  else if (!METER_ID_RE.test(id)) errors.meterId = "Use the format M-1234.";

  if (!v.ownerId) errors.ownerId = "Choose the customer who owns this meter.";

  const address = v.address.trim();
  if (!address) errors.address = "Installation address is required.";
  else if (address.length < 5) errors.address = "Address is too short.";
  else if (address.length > 120) errors.address = "Keep the address under 120 characters.";

  if (!v.tariffCategory) errors.tariffCategory = "Choose a tariff category.";

  if (!v.installedDate) errors.installedDate = "Installation date is required.";
  else if (v.installedDate > today()) errors.installedDate = "Installation date cannot be in the future.";

  return errors;
}

export function validateCustomerForm(v: CustomerFormValues): FormErrors<CustomerFormValues> {
  const errors: FormErrors<CustomerFormValues> = {};
  const name = v.name.trim();
  if (!name) errors.name = "Full name is required.";
  else if (name.length < 2 || name.length > 60) errors.name = "Name must be 2 to 60 characters.";
  else if (!NAME_RE.test(name)) errors.name = "Use letters, spaces, dots, apostrophes or hyphens only.";

  const email = v.email.trim();
  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  const phone = v.phone.replace(/\s+/g, " ").trim();
  if (!phone) errors.phone = "Phone number is required.";
  else if (!PHONE_RE.test(phone)) errors.phone = "Enter a 10-digit mobile number, e.g. +91 9876543210.";

  return errors;
}

export interface DateRangeErrors {
  from?: string;
  to?: string;
}

// Dates are YYYY-MM-DD strings, so string comparison is date comparison.
export function validateDateRange(from: string, to: string, min: string, max: string): DateRangeErrors {
  const errors: DateRangeErrors = {};
  if (!from) errors.from = "Choose a start date.";
  else if (from < min || from > max) errors.from = `Data is available from ${min} to ${max}.`;
  if (!to) errors.to = "Choose an end date.";
  else if (to < min || to > max) errors.to = `Data is available from ${min} to ${max}.`;
  if (!errors.from && !errors.to && from > to) errors.to = "End date must be on or after the start date.";
  return errors;
}

// Parses a numeric input; returns null when it is not a finite number.
const toNumber = (s: string): number | null => (s.trim() === "" || !Number.isFinite(Number(s)) ? null : Number(s));

export function validateSettingsForm(v: SettingsFormValues): FormErrors<SettingsFormValues> {
  const errors: FormErrors<SettingsFormValues> = {};

  const high = toNumber(v.highConsumptionKwh);
  if (high === null) errors.highConsumptionKwh = "Enter a number.";
  else if (high <= 0 || high > 1000) errors.highConsumptionKwh = "Must be between 0 and 1000 kWh.";

  const low = toNumber(v.lowConsumptionKwh);
  if (low === null) errors.lowConsumptionKwh = "Enter a number.";
  else if (low < 0) errors.lowConsumptionKwh = "Cannot be negative.";
  else if (high !== null && low >= high) errors.lowConsumptionKwh = "Must be lower than the high-consumption threshold.";

  const abnormal = toNumber(v.abnormalReadingsPerDay);
  if (abnormal === null) errors.abnormalReadingsPerDay = "Enter a number.";
  else if (!Number.isInteger(abnormal) || abnormal < 1 || abnormal > 50)
    errors.abnormalReadingsPerDay = "Use a whole number from 1 to 50.";

  const inactive = toNumber(v.inactiveMeterHours);
  if (inactive === null) errors.inactiveMeterHours = "Enter a number.";
  else if (!Number.isInteger(inactive) || inactive < 1 || inactive > 720)
    errors.inactiveMeterHours = "Use a whole number of hours from 1 to 720 (30 days).";

  if (!v.email && !v.sms && !v.inApp) errors.inApp = "Keep at least one notification channel on.";

  return errors;
}
