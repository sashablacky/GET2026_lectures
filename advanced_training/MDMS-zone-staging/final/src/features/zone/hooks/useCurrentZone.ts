import { useApi } from "../../../shared/hooks/useApi";
import { CURRENT_ZONE_ID } from "../constants";
import { getZone } from "../services/zoneService";

export function useCurrentZone() {
  const { data } = useApi((signal) => getZone(CURRENT_ZONE_ID, signal), `zone:${CURRENT_ZONE_ID}`);
  return { zoneId: CURRENT_ZONE_ID, zoneName: data?.name ?? "…", zone: data };
}
