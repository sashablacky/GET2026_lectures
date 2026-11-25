import { demoAccounts } from "../../shared/session/demoAccounts";

// TEMPORARY (Phase 1): the zone of the demo zone admin. In Phase 2 this
// comes from the logged-in user.
export const CURRENT_ZONE_ID = demoAccounts.zone.zoneId ?? "ZN-001";

// Phase 1 is read-only: forms validate but nothing is saved yet.
export const NOT_SAVED_NOTE = "Saving to the server comes in Phase 2.";
