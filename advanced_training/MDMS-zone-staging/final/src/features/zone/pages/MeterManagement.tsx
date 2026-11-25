import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileText, Plus } from "lucide-react";
import PageHeader from "../../../shared/components/ui/PageHeader";
import Button from "../../../shared/components/ui/Button";
import Select from "../../../shared/components/forms/Select";
import MeterTable from "../../../shared/components/meters/MeterTable";
import type { RowAction } from "../../../shared/components/data/DataTable";
import { useApi } from "../../../shared/hooks/useApi";
import { useTableState } from "../../../shared/hooks/useTableState";
import { errorMessage } from "../../../shared/utils/format";
import type { Meter, MeterStatus } from "../../../shared/types/models";
import { useCurrentZone } from "../hooks/useCurrentZone";
import { getZoneMeters } from "../services/meterService";
import MeterFormModal from "../components/MeterFormModal";
import StatusChangeDialog from "../components/StatusChangeDialog";
import type { StatusChangeTarget } from "../components/StatusChangeDialog";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Pending", label: "Pending" },
  { value: "Deactivated", label: "Deactivated" },
];

export default function MeterManagement() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { zoneId, zoneName } = useCurrentZone();

  const table = useTableState({
    sort: { field: "id", direction: "asc" },
    filters: { status: "" as MeterStatus | "" },
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Meter | null>(null);
  const [statusTarget, setStatusTarget] = useState<StatusChangeTarget | null>(null);

  // "Add meter" on the dashboard links here with ?add=1
  const adding = searchParams.get("add") === "1";
  const closeAdd = () =>
    setSearchParams(
      (p) => {
        p.delete("add");
        return p;
      },
      { replace: true },
    );

  const params = {
    page: table.page,
    pageSize: table.pageSize,
    sort: table.sort,
    search: table.debouncedSearch,
    status: table.filters.status,
  };
  const meters = useApi((s) => getZoneMeters(zoneId, params, s), `meters:${zoneId}:${JSON.stringify(params)}`);

  const rowActions: RowAction<Meter>[] = [
    { label: "View details", onClick: (m) => navigate(`/zone/meters/${m.id}`) },
    { label: "Edit", onClick: (m) => setEditing(m) },
    {
      label: (m) => (m.status === "Active" ? "Deactivate" : "Activate"),
      danger: (m) => m.status === "Active",
      onClick: (m) =>
        setStatusTarget({ kind: "meter", id: m.id, name: m.ownerName, activate: m.status !== "Active" }),
    },
  ];

  return (
    <div className="page">
      <PageHeader
        title="Meter management"
        subtitle={`Devices in zone ${zoneName}`}
        actions={
          <>
            <Button
              variant="primary"
              icon={<Plus size={16} />}
              onClick={() => setSearchParams({ add: "1" }, { replace: true })}
            >
              Add meter
            </Button>
            <Button icon={<FileText size={16} />} onClick={() => navigate("/zone/reports")}>
              Generate report
            </Button>
          </>
        }
      />

      <MeterTable
        rows={meters.data?.data ?? []}
        loading={meters.loading}
        error={meters.error ? errorMessage(meters.error) : undefined}
        meterLink={(m) => `/zone/meters/${m.id}`}
        sort={table.sort}
        onSortChange={table.setSort}
        search={{ value: table.search, onChange: table.setSearch, placeholder: "Search by meter ID or owner" }}
        toolbar={
          <Select
            compact
            label="Status"
            placeholder="All statuses"
            options={statusOptions}
            value={table.filters.status}
            onChange={(e) => table.setFilter("status", e.target.value as MeterStatus | "")}
          />
        }
        pagination={{
          page: table.page,
          pageSize: table.pageSize,
          total: meters.data?.items ?? 0,
          onPageChange: table.setPage,
        }}
        selection={{ selected, onChange: setSelected }}
        rowActions={rowActions}
        emptyMessage="Try another search or status filter."
      />

      {adding && <MeterFormModal zoneId={zoneId} zoneName={zoneName} onClose={closeAdd} />}
      {editing && (
        <MeterFormModal
          key={editing.id}
          zoneId={zoneId}
          zoneName={zoneName}
          meter={editing}
          onClose={() => setEditing(null)}
        />
      )}
      <StatusChangeDialog target={statusTarget} onClose={() => setStatusTarget(null)} />
    </div>
  );
}
