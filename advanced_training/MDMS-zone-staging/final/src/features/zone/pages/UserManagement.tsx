import { useState } from "react";
import { UserPlus } from "lucide-react";
import PageHeader from "../../../shared/components/ui/PageHeader";
import Button from "../../../shared/components/ui/Button";
import Select from "../../../shared/components/forms/Select";
import DataTable from "../../../shared/components/data/DataTable";
import type { Column, RowAction } from "../../../shared/components/data/DataTable";
import StatusBadge from "../../../shared/components/data/StatusBadge";
import { useApi } from "../../../shared/hooks/useApi";
import { useTableState } from "../../../shared/hooks/useTableState";
import { errorMessage } from "../../../shared/utils/format";
import type { User, UserStatus } from "../../../shared/types/models";
import { useCurrentZone } from "../hooks/useCurrentZone";
import { getZoneCustomers } from "../services/customerService";
import CustomerDetailsModal from "../components/CustomerDetailsModal";
import CustomerFormModal from "../components/CustomerFormModal";
import StatusChangeDialog from "../components/StatusChangeDialog";
import type { StatusChangeTarget } from "../components/StatusChangeDialog";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Deactivated", label: "Deactivated" },
];

const columns: Column<User>[] = [
  { key: "id", header: "ID", sortable: true, render: (u) => <strong>{u.id}</strong> },
  { key: "name", header: "Name", sortable: true },
  { key: "email", header: "Email", sortable: true },
  { key: "phone", header: "Phone" },
  { key: "meterCount", header: "Meters", sortable: true, align: "right", render: (u) => u.meterCount ?? 0 },
  { key: "status", header: "Status", sortable: true, render: (u) => <StatusBadge status={u.status} /> },
];

// About the person (customer account). Devices are on Meter Management.
export default function UserManagement() {
  const { zoneId, zoneName } = useCurrentZone();
  const table = useTableState({
    sort: { field: "name", direction: "asc" },
    filters: { status: "" as UserStatus | "" },
  });
  const [viewing, setViewing] = useState<User | null>(null);
  const [adding, setAdding] = useState(false);
  const [statusTarget, setStatusTarget] = useState<StatusChangeTarget | null>(null);

  const params = {
    page: table.page,
    pageSize: table.pageSize,
    sort: table.sort,
    search: table.debouncedSearch,
    status: table.filters.status,
  };
  const customers = useApi(
    (s) => getZoneCustomers(zoneId, params, s),
    `customers:${zoneId}:${JSON.stringify(params)}`,
  );

  const rowActions: RowAction<User>[] = [
    { label: "View", onClick: setViewing },
    {
      label: (u) => (u.status === "Active" ? "Deactivate" : "Activate"),
      danger: (u) => u.status === "Active",
      onClick: (u) => setStatusTarget({ kind: "customer", id: u.id, name: u.name, activate: u.status !== "Active" }),
    },
  ];

  return (
    <div className="page">
      <PageHeader
        title="User management"
        subtitle={`Customers in zone ${zoneName}`}
        actions={
          <Button variant="primary" icon={<UserPlus size={16} />} onClick={() => setAdding(true)}>
            Add customer
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={customers.data?.data ?? []}
        rowKey={(u) => u.id}
        loading={customers.loading}
        error={customers.error ? errorMessage(customers.error) : undefined}
        sort={table.sort}
        onSortChange={table.setSort}
        search={{ value: table.search, onChange: table.setSearch, placeholder: "Search by ID, name, email or phone" }}
        toolbar={
          <Select
            compact
            label="Status"
            placeholder="All statuses"
            options={statusOptions}
            value={table.filters.status}
            onChange={(e) => table.setFilter("status", e.target.value as UserStatus | "")}
          />
        }
        pagination={{
          page: table.page,
          pageSize: table.pageSize,
          total: customers.data?.items ?? 0,
          onPageChange: table.setPage,
        }}
        rowActions={rowActions}
        emptyTitle="No customers found"
        emptyMessage="Try another search or status filter."
      />

      {viewing && <CustomerDetailsModal key={viewing.id} customer={viewing} onClose={() => setViewing(null)} />}
      {adding && <CustomerFormModal zoneName={zoneName} onClose={() => setAdding(false)} />}
      <StatusChangeDialog target={statusTarget} onClose={() => setStatusTarget(null)} />
    </div>
  );
}
