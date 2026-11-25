import Modal from "../../../shared/components/feedback/Modal";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/forms/Input";
import Select from "../../../shared/components/forms/Select";
import { useToast } from "../../../shared/components/feedback/toast-context";
import { useApi } from "../../../shared/hooks/useApi";
import { useForm } from "../../../shared/hooks/useForm";
import type { Meter } from "../../../shared/types/models";
import { NOT_SAVED_NOTE } from "../constants";
import { getZoneCustomerOptions } from "../services/customerService";
import { validateMeterForm } from "../utils/validation";
import type { MeterFormValues } from "../types/zone";

const tariffOptions = [
  { value: "Domestic", label: "Domestic" },
  { value: "Commercial", label: "Commercial" },
  { value: "Industrial", label: "Industrial" },
];

interface MeterFormModalProps {
  zoneId: string;
  zoneName: string;
  meter?: Meter; // edit mode when given
  onClose: () => void;
}

// Add / edit meter form. Phase 1: validates only, nothing is saved.
export default function MeterFormModal({ zoneId, zoneName, meter, onClose }: MeterFormModalProps) {
  const { showToast } = useToast();
  const editing = meter !== undefined;
  const customers = useApi((s) => getZoneCustomerOptions(zoneId, s), `customer-options:${zoneId}`);

  const { values, errors, setField, handleSubmit } = useForm<MeterFormValues>(
    {
      meterId: meter?.id ?? "",
      ownerId: meter?.ownerId ?? "",
      address: meter?.address ?? "",
      tariffCategory: meter?.tariffCategory ?? "",
      installedDate: meter?.installedDate ?? "",
    },
    validateMeterForm,
  );

  // The current owner stays selectable even if the account is deactivated
  const ownerOptions = (customers.data ?? []).map((c) => ({ value: c.id, label: `${c.name} (${c.id})` }));
  if (meter && !ownerOptions.some((o) => o.value === meter.ownerId))
    ownerOptions.unshift({ value: meter.ownerId, label: `${meter.ownerName} (${meter.ownerId})` });

  const submit = handleSubmit((v) => {
    showToast(`Meter ${v.meterId.trim()} ${editing ? "updated" : "added"}: details are valid. ${NOT_SAVED_NOTE}`, "info");
    onClose();
  });

  return (
    <Modal
      open
      onClose={onClose}
      title={editing ? `Edit meter ${meter.id}` : "Add meter"}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="meter-form">
            {editing ? "Save changes" : "Add meter"}
          </Button>
        </>
      }
    >
      <form id="meter-form" onSubmit={submit} noValidate>
        <Input
          label="Meter ID"
          placeholder="M-1234"
          value={values.meterId}
          onChange={(e) => setField("meterId", e.target.value)}
          error={errors.meterId}
          readOnly={editing}
        />
        <Select
          label="Owner (customer)"
          placeholder={customers.loading ? "Loading customers…" : "Select a customer"}
          options={ownerOptions}
          value={values.ownerId}
          onChange={(e) => setField("ownerId", e.target.value)}
          error={errors.ownerId}
        />
        <Input
          label="Installation address"
          placeholder="House no., street, area"
          value={values.address}
          onChange={(e) => setField("address", e.target.value)}
          error={errors.address}
        />
        <div className="form-grid">
          <Select
            label="Tariff category"
            placeholder="Select a category"
            options={tariffOptions}
            value={values.tariffCategory}
            onChange={(e) => setField("tariffCategory", e.target.value as MeterFormValues["tariffCategory"])}
            error={errors.tariffCategory}
          />
          <Input
            label="Installed on"
            type="date"
            value={values.installedDate}
            onChange={(e) => setField("installedDate", e.target.value)}
            error={errors.installedDate}
          />
        </div>
        <p className="field__hint">
          The meter belongs to zone <strong>{zoneName}</strong>. A meter has exactly one owner and one zone.
        </p>
      </form>
    </Modal>
  );
}
