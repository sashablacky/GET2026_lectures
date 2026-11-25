import { useState } from "react";
import Modal from "../../../shared/components/feedback/Modal";
import Tabs from "../../../shared/components/ui/Tabs";
import StatusBadge from "../../../shared/components/data/StatusBadge";
import MeterTable from "../../../shared/components/meters/MeterTable";
import { useApi } from "../../../shared/hooks/useApi";
import type { User } from "../../../shared/types/models";
import { errorMessage, formatDate } from "../../../shared/utils/format";
import { getMetersByOwner } from "../services/meterService";

type Tab = "details" | "meters";

interface CustomerDetailsModalProps {
  customer: User;
  onClose: () => void;
}

// The person and the meters they own. Meter actions live on Meter Management.
export default function CustomerDetailsModal({ customer, onClose }: CustomerDetailsModalProps) {
  const [tab, setTab] = useState<Tab>("details");
  const meters = useApi((s) => getMetersByOwner(customer.id, s), `owner-meters:${customer.id}`);
  const meterCount = meters.data?.length ?? customer.meterCount ?? 0;

  return (
    <Modal open onClose={onClose} title={customer.name} size="lg">
      <Tabs<Tab>
        label="Customer sections"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "details", label: "Details" },
          { id: "meters", label: `Meters (${meterCount})` },
        ]}
      />
      {tab === "details" ? (
        <dl className="detail-grid">
          <div>
            <dt>Customer ID</dt>
            <dd>{customer.id}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <StatusBadge status={customer.status} />
            </dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{customer.email}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{customer.phone}</dd>
          </div>
          <div>
            <dt>Customer since</dt>
            <dd>{formatDate(customer.joinedOn)}</dd>
          </div>
          <div>
            <dt>Meters owned</dt>
            <dd>{meterCount}</dd>
          </div>
        </dl>
      ) : (
        <MeterTable
          rows={meters.data ?? []}
          loading={meters.loading}
          error={meters.error ? errorMessage(meters.error) : undefined}
          meterLink={(m) => `/zone/meters/${m.id}`}
          emptyTitle="No meters"
          emptyMessage="This customer does not own any meters yet."
        />
      )}
    </Modal>
  );
}
