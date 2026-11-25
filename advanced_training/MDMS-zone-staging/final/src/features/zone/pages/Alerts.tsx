import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../../shared/components/ui/PageHeader";
import Select from "../../../shared/components/forms/Select";
import DataTable from "../../../shared/components/data/DataTable";
import type { Column, RowAction } from "../../../shared/components/data/DataTable";
import StatusBadge from "../../../shared/components/data/StatusBadge";
import { useApi } from "../../../shared/hooks/useApi";
import { useTableState } from "../../../shared/hooks/useTableState";
import { errorMessage, formatDateTime } from "../../../shared/utils/format";
import type { Alert, AlertSeverity, AlertStatus } from "../../../shared/types/models";
import { useCurrentZone } from "../hooks/useCurrentZone";
import { getZoneAlerts } from "../services/alertService";

const severityOptions = [
  { value: "Critical", label: "Critical" },
  { value: "Warning", label: "Warning" },
  { value: "Info", label: "Info" },
];
const statusOptions = [
  { value: "Open", label: "Open" },
  { value: "Acknowledged", label: "Acknowledged" },
  { value: "Resolved", label: "Resolved" },
];

const columns: Column<Alert>[] = [
  { key: "id", header: "Alert ID", sortable: true, render: (a) => <strong>{a.id}</strong> },
  { key: "type", header: "Type", sortable: true },
  {
    key: "meterId",
    header: "Meter",
    sortable: true,
    render: (a) => (
      <Link to={`/zone/meters/${a.meterId}`} className="link">
        {a.meterId}
      </Link>
    ),
  },
  { key: "severity", header: "Severity", sortable: true, render: (a) => <StatusBadge status={a.severity} /> },
  { key: "status", header: "Status", sortable: true, render: (a) => <StatusBadge status={a.status} /> },
  { key: "createdAt", header: "Raised", sortable: true, render: (a) => formatDateTime(a.createdAt) },
];

export default function Alerts() {
  const navigate = useNavigate();
  const { zoneId, zoneName } = useCurrentZone();
  const table = useTableState({
    sort: { field: "createdAt", direction: "desc" },
    filters: { severity: "" as AlertSeverity | "", status: "" as AlertStatus | "" },
  });

  const params = {
    page: table.page,
    pageSize: table.pageSize,
    sort: table.sort,
    search: table.debouncedSearch,
    severity: table.filters.severity,
    status: table.filters.status,
  };
  const alerts = useApi((s) => getZoneAlerts(zoneId, params, s), `alerts:${zoneId}:${JSON.stringify(params)}`);

  const rowActions: RowAction<Alert>[] = [
    { label: "View meter", onClick: (a) => navigate(`/zone/meters/${a.meterId}`) },
  ];

  return (
    <div className="page">
      <PageHeader title="Alerts" subtitle={`Alerts raised by meters in zone ${zoneName}`} />
      <DataTable
        columns={columns}
        rows={alerts.data?.data ?? []}
        rowKey={(a) => a.id}
        loading={alerts.loading}
        error={alerts.error ? errorMessage(alerts.error) : undefined}
        sort={table.sort}
        onSortChange={table.setSort}
        search={{ value: table.search, onChange: table.setSearch, placeholder: "Search by alert ID, meter or type" }}
        toolbar={
          <>
            <Select
              compact
              label="Severity"
              placeholder="All severities"
              options={severityOptions}
              value={table.filters.severity}
              onChange={(e) => table.setFilter("severity", e.target.value as AlertSeverity | "")}
            />
            <Select
              compact
              label="Status"
              placeholder="All statuses"
              options={statusOptions}
              value={table.filters.status}
              onChange={(e) => table.setFilter("status", e.target.value as AlertStatus | "")}
            />
          </>
        }
        pagination={{
          page: table.page,
          pageSize: table.pageSize,
          total: alerts.data?.items ?? 0,
          onPageChange: table.setPage,
        }}
        rowActions={rowActions}
        emptyTitle="No alerts"
        emptyMessage="No alerts match these filters."
      />
    </div>
  );
}
