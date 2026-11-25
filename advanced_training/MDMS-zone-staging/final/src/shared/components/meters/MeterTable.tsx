import { Link } from "react-router-dom";
import DataTable from "../data/DataTable";
import type { Column, DataTableProps } from "../data/DataTable";
import StatusBadge from "../data/StatusBadge";
import type { Meter } from "../../types/models";
import { formatDateTime, formatKwh } from "../../utils/format";

interface MeterTableProps extends Omit<DataTableProps<Meter>, "columns" | "rowKey"> {
  // Enterprise shows the zone column; a zone admin sees one zone only.
  showZone?: boolean;
  // Link target for the meter ID, e.g. the meter details page.
  meterLink?: (meter: Meter) => string;
}

// One meter table for the zone and enterprise Meter Management pages.
export default function MeterTable({ showZone = false, meterLink, ...tableProps }: MeterTableProps) {
  const columns: Column<Meter>[] = [
    {
      key: "id",
      header: "Meter ID",
      sortable: true,
      render: (m) =>
        meterLink ? (
          <Link to={meterLink(m)} className="link">
            {m.id}
          </Link>
        ) : (
          <strong>{m.id}</strong>
        ),
    },
    { key: "ownerName", header: "Owner", sortable: true },
    ...(showZone ? [{ key: "zoneName", header: "Zone", sortable: true }] : []),
    { key: "tariffCategory", header: "Tariff", sortable: true },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (m) => <StatusBadge status={m.status} />,
    },
    {
      key: "lastReadingKwh",
      header: "Last reading",
      sortable: true,
      render: (m) =>
        m.lastReadingKwh === null ? (
          <span className="muted">No readings</span>
        ) : (
          <span className="mono">
            {formatKwh(m.lastReadingKwh)}
            <br />
            <span className="muted">{formatDateTime(m.lastReadingAt)}</span>
          </span>
        ),
    },
  ];

  return <DataTable columns={columns} rowKey={(m) => m.id} emptyTitle="No meters found" {...tableProps} />;
}
