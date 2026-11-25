// Generates db.json for JSON Server. Run with: npm run seed
// db.json is a generated file. Change this script, not db.json.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fakerEN_IN as faker } from "@faker-js/faker";

faker.seed(2026); // same data on every machine
const NOW = new Date("2026-11-24T10:00:00+05:30");
const CUSTOMERS_PER_ZONE = 15;

// ---------- helpers ----------
const pad = (n, len = 3) => String(n).padStart(len, "0");
const pick = (items) => faker.helpers.arrayElement(items);
const weighted = (pairs) =>
  faker.helpers.weightedArrayElement(
    pairs.map(([value, weight]) => ({ value, weight })),
  );
const dateOnly = (d) => d.toISOString().slice(0, 10);
const round = (n, digits = 2) => Number(n.toFixed(digits));
const recent = (days) => faker.date.recent({ days, refDate: NOW });

// ---------- users ----------
const users = [];
function addUser(role, zoneId, status = "Active") {
  const first = faker.person.firstName();
  const last = faker.person.lastName();
  const n = users.length + 1;
  const user = {
    id: `U-${pad(n)}`,
    name: `${first} ${last}`,
    email: `${first}.${last}${n}@example.com`
      .toLowerCase()
      .replace(/[^a-z0-9.@]/g, ""),
    phone: `+91 ${pick(["6", "7", "8", "9"])}${faker.string.numeric(9)}`,
    role, // "enterprise" | "zone_admin" | "customer"
    zoneId, // null for the enterprise admin
    status,
    joinedOn: dateOnly(faker.date.past({ years: 4, refDate: NOW })),
  };
  users.push(user);
  return user;
}

addUser("enterprise", null);

// ---------- zones (each gets one admin) ----------
const zoneSeeds = [
  {
    name: "Mangalore",
    location: "Mangaluru, Dakshina Kannada",
    pincode: "575001",
  },
  { name: "Udupi", location: "Udupi, Karnataka", pincode: "576101" },
  { name: "Surathkal", location: "Surathkal, Mangaluru", pincode: "575014" },
  { name: "Mulki", location: "Mulki, Dakshina Kannada", pincode: "574154" },
  { name: "Padil", location: "Padil, Mangaluru", pincode: "575007" },
  { name: "Bajpe", location: "Bajpe, Mangaluru", pincode: "574142" },
];

const zones = zoneSeeds.map((seed, i) => {
  const id = `ZN-${pad(i + 1)}`;
  const admin = addUser("zone_admin", id);
  return {
    id,
    ...seed,
    description: `Electricity distribution zone covering ${seed.name} and nearby areas.`,
    adminId: admin.id,
    adminName: admin.name,
    status: "Active",
    totalMeters: 0,
    totalUsers: 0,
  };
});

// ---------- customers and meters ----------
// A meter takes its zone from its owner, so it can never sit in two zones.
const meters = [];
for (const zone of zones) {
  for (let c = 0; c < CUSTOMERS_PER_ZONE; c++) {
    const owner = addUser(
      "customer",
      zone.id,
      weighted([
        ["Active", 92],
        ["Deactivated", 8],
      ]),
    );
    const meterCount = faker.datatype.boolean({ probability: 0.3 }) ? 2 : 1;

    for (let m = 0; m < meterCount; m++) {
      const status =
        owner.status === "Active"
          ? weighted([
              ["Active", 90],
              ["Pending", 5],
              ["Deactivated", 5],
            ])
          : "Deactivated";
      const hasReading = status === "Active";
      meters.push({
        id: `M-${1000 + meters.length + 1}`,
        ownerId: owner.id,
        ownerName: owner.name,
        zoneId: zone.id,
        zoneName: zone.name,
        address: `${faker.location.streetAddress()}, ${zone.name}`,
        status,
        lastReadingKwh: hasReading
          ? faker.number.int({ min: 800, max: 9000 })
          : null,
        lastReadingAt: hasReading ? recent(1).toISOString() : null,
        installedDate: dateOnly(faker.date.past({ years: 5, refDate: NOW })),
        tariffCategory: weighted([
          ["Domestic", 75],
          ["Commercial", 20],
          ["Industrial", 5],
        ]),
      });
    }
  }
}

for (const zone of zones) {
  zone.totalMeters = meters.filter((m) => m.zoneId === zone.id).length;
  zone.totalUsers = users.filter(
    (u) => u.role === "customer" && u.zoneId === zone.id,
  ).length;
}

// ---------- alerts ----------
const alertTypes = [
  { type: "High consumption", severities: ["Warning", "Critical"] },
  { type: "Abnormal reading", severities: ["Critical", "Warning"] },
  { type: "Inactive meter", severities: ["Warning"] },
  { type: "Low consumption", severities: ["Info"] },
  { type: "Tamper detected", severities: ["Critical"] },
];
const activeMeters = meters.filter((m) => m.status === "Active");

const alerts = Array.from({ length: 40 }, () => {
  const meter = pick(activeMeters);
  const t = pick(alertTypes);
  return {
    meterId: meter.id,
    zoneId: meter.zoneId,
    zoneName: meter.zoneName,
    type: t.type,
    severity: pick(t.severities), // "Critical" | "Warning" | "Info"
    status: weighted([
      ["Open", 50],
      ["Acknowledged", 25],
      ["Resolved", 25],
    ]),
    message: `${t.type} on ${meter.id} in ${meter.zoneName}`,
    createdAt: recent(30).toISOString(),
  };
})
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  .map((a, i) => ({ id: `AL-${pad(i + 1)}`, ...a }));

// ---------- audit logs ----------
const customers = users.filter((u) => u.role === "customer");
const actors = users.filter((u) => u.role !== "customer");
const inScope = (list, actor) =>
  actor.zoneId ? list.filter((x) => x.zoneId === actor.zoneId) : list;

const actionTemplates = [
  {
    action: "Login",
    roles: ["enterprise", "zone_admin"],
    resource: () => "Session",
  },
  {
    action: "Logout",
    roles: ["enterprise", "zone_admin"],
    resource: () => "Session",
  },
  {
    action: "Create zone",
    roles: ["enterprise"],
    resource: () => `Zone ${pick(zones).id}`,
  },
  {
    action: "Update zone",
    roles: ["enterprise"],
    resource: () => `Zone ${pick(zones).id}`,
  },
  {
    action: "Update settings",
    roles: ["enterprise"],
    resource: () => "Enterprise settings",
  },
  {
    action: "Add meter",
    roles: ["zone_admin"],
    resource: (a) => `Meter ${pick(inScope(meters, a)).id}`,
  },
  {
    action: "Deactivate meter",
    roles: ["zone_admin"],
    resource: (a) => `Meter ${pick(inScope(meters, a)).id}`,
  },
  {
    action: "Add customer",
    roles: ["zone_admin"],
    resource: (a) => `User ${pick(inScope(customers, a)).id}`,
  },
  {
    action: "Generate report",
    roles: ["enterprise", "zone_admin"],
    resource: () => "Report",
  },
];

const auditLogs = Array.from({ length: 60 }, () => {
  const actor = pick(actors);
  const template = pick(
    actionTemplates.filter((t) => t.roles.includes(actor.role)),
  );
  return {
    timestamp: recent(30).toISOString(),
    userId: actor.id,
    userName: actor.name,
    role: actor.role,
    action: template.action,
    resource: template.resource(actor),
    status: weighted([
      ["Success", 90],
      ["Failed", 10],
    ]),
  };
})
  .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  .map((l, i) => ({ id: `LOG-${pad(i + 1, 4)}`, ...l }));

// ---------- enterprise settings (single object) ----------
const enterpriseSettings = {
  dataRetention: { meterReadingsMonths: 24, alertsMonths: 12 },
  policies: { autoLogoutMinutes: 30, auditLogRetentionDays: 365 },
  localisation: {
    timeZone: "Asia/Kolkata",
    defaultLanguage: "en",
    currency: "INR",
  },
  notificationDefaults: { email: true, sms: false, inApp: true },
};

// ---------- consumption per zone (average kWh per meter) ----------
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const monthLabels = Array.from({ length: 12 }, (_, i) => {
  const d = new Date(
    Date.UTC(NOW.getUTCFullYear(), NOW.getUTCMonth() - 11 + i, 1),
  );
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
});
const periodLabels = {
  day: Array.from({ length: 24 }, (_, h) => `${pad(h, 2)}:00`),
  week: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
  month: monthLabels,
  year: ["2024", "2025", "2026"],
};
const periodScale = { day: 0.6, week: 60, month: 260, year: 3100 };

const zoneConsumption = [];
for (const zone of zones) {
  const zoneFactor = faker.number.float({ min: 0.8, max: 1.3 });
  for (const [period, labels] of Object.entries(periodLabels)) {
    labels.forEach((label, i) => {
      const hourShape =
        period === "day" ? (i >= 18 && i <= 22 ? 1.8 : i < 6 ? 0.5 : 1) : 1;
      zoneConsumption.push({
        id: `ZC-${pad(zoneConsumption.length + 1, 4)}`,
        zoneId: zone.id,
        zoneName: zone.name,
        period, // "day" | "week" | "month" | "year"
        label,
        avgKwh: round(
          periodScale[period] *
            zoneFactor *
            hourShape *
            faker.number.float({ min: 0.8, max: 1.2 }),
        ),
      });
    });
  }
}

// Everything below the zone consumption runs after the existing faker calls,
// so adding it does not change the data generated above.

// ---------- meter count per customer (for the zone user table) ----------
for (const u of users) {
  if (u.role === "customer")
    u.meterCount = meters.filter((m) => m.ownerId === u.id).length;
}

// ---------- daily meter readings (last 90 days, active meters only) ----------
// readingKwh is the cumulative register value at the end of the day.
const READING_DAYS = 90;
const dailyBase = {
  Domestic: [4, 9],
  Commercial: [10, 20],
  Industrial: [25, 45],
};
const readingDates = Array.from({ length: READING_DAYS }, (_, i) => {
  const d = new Date(NOW);
  d.setUTCDate(d.getUTCDate() - (READING_DAYS - 1 - i));
  return dateOnly(d);
});

const meterReadings = [];
for (const meter of activeMeters) {
  const [min, max] = dailyBase[meter.tariffCategory];
  const base = faker.number.float({ min, max });
  let register = faker.number.int({ min: 1500, max: 12000 });
  for (const date of readingDates) {
    const weekday = new Date(date).getUTCDay();
    const weekFactor =
      meter.tariffCategory === "Domestic"
        ? weekday === 0 || weekday === 6
          ? 1.25
          : 1
        : weekday === 0
          ? 0.6
          : 1;
    const consumptionKwh = round(
      base * weekFactor * faker.number.float({ min: 0.75, max: 1.25 }),
    );
    register = round(register + consumptionKwh);
    meterReadings.push({
      id: `MR-${pad(meterReadings.length + 1, 5)}`,
      meterId: meter.id,
      zoneId: meter.zoneId,
      date,
      readingKwh: register,
      consumptionKwh,
    });
  }
  // The meter's last reading is the end of its reading history.
  meter.lastReadingKwh = register;
}

// ---------- daily consumption per zone (sum of its meters) ----------
const zoneDailyConsumption = [];
for (const zone of zones) {
  const zoneReadings = meterReadings.filter((r) => r.zoneId === zone.id);
  for (const date of readingDates) {
    const day = zoneReadings.filter((r) => r.date === date);
    const totalKwh = round(day.reduce((sum, r) => sum + r.consumptionKwh, 0));
    zoneDailyConsumption.push({
      id: `ZD-${pad(zoneDailyConsumption.length + 1, 4)}`,
      zoneId: zone.id,
      date,
      totalKwh,
      meterCount: day.length,
      avgKwhPerMeter: day.length ? round(totalKwh / day.length) : 0,
    });
  }
}

// ---------- zone alert settings (one per zone, id = zone id) ----------
const zoneSettings = zones.map((zone) => ({
  id: zone.id,
  zoneId: zone.id,
  thresholds: {
    highConsumptionKwh: pick([30, 35, 40]), // per meter per day
    lowConsumptionKwh: pick([1, 2, 3]), // per meter per day
    abnormalReadingsPerDay: pick([3, 4, 5]),
    inactiveMeterHours: pick([24, 48, 72]),
  },
  channels: { email: true, sms: faker.datatype.boolean(), inApp: true },
}));

// ---------- sample data from the Setup Guide ----------
// Kept so the existing end-user Dashboard keeps working until it uses real series.
const dailyData = [
  { id: "1", date: "2026-11-01", units: 12.5 },
  { id: "2", date: "2026-11-02", units: 14.2 },
  { id: "3", date: "2026-11-03", units: 11.8 },
];
const weeklyData = [
  { id: "1", week: "Week 1", units: 85.4 },
  { id: "2", week: "Week 2", units: 92.1 },
];
const monthlyData = [
  { id: "1", month: "October", units: 370.6 },
  { id: "2", month: "November", units: 348.9 },
];

// ---------- checks for the system rules ----------
const userById = new Map(users.map((u) => [u.id, u]));
for (const m of meters) {
  const owner = userById.get(m.ownerId);
  if (!owner || owner.zoneId !== m.zoneId)
    throw new Error(`Meter ${m.id} breaks the zone rule`);
}
for (const [name, list] of Object.entries({
  users,
  zones,
  meters,
  alerts,
  auditLogs,
  zoneConsumption,
  meterReadings,
  zoneDailyConsumption,
  zoneSettings,
})) {
  if (new Set(list.map((x) => x.id)).size !== list.length)
    throw new Error(`Duplicate ids in ${name}`);
}

// ---------- write db.json ----------
const db = {
  zones,
  users,
  meters,
  alerts,
  auditLogs,
  enterpriseSettings,
  zoneConsumption,
  meterReadings,
  zoneDailyConsumption,
  zoneSettings,
  dailyData,
  weeklyData,
  monthlyData,
};
writeFileSync(
  fileURLToPath(new URL("../db.json", import.meta.url)),
  JSON.stringify(db, null, 2),
);

console.log(
  `db.json written: ${zones.length} zones, ${users.length} users, ${meters.length} meters, ` +
    `${alerts.length} alerts, ${auditLogs.length} audit logs, ${zoneConsumption.length} consumption rows, ` +
    `${meterReadings.length} meter readings`,
);
