import Modal from "../../../shared/components/feedback/Modal";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/forms/Input";
import { useToast } from "../../../shared/components/feedback/toast-context";
import { useForm } from "../../../shared/hooks/useForm";
import { NOT_SAVED_NOTE } from "../constants";
import { validateCustomerForm } from "../utils/validation";
import type { CustomerFormValues } from "../types/zone";

interface CustomerFormModalProps {
  zoneName: string;
  onClose: () => void;
}

// There is no registration page: the zone admin creates customer accounts.
// Phase 1: validates only, nothing is saved.
export default function CustomerFormModal({ zoneName, onClose }: CustomerFormModalProps) {
  const { showToast } = useToast();
  const { values, errors, setField, handleSubmit } = useForm<CustomerFormValues>(
    { name: "", email: "", phone: "" },
    validateCustomerForm,
  );

  const submit = handleSubmit((v) => {
    showToast(`Customer ${v.name.trim()} is valid. ${NOT_SAVED_NOTE}`, "info");
    onClose();
  });

  return (
    <Modal
      open
      onClose={onClose}
      title="Add customer"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="customer-form">
            Add customer
          </Button>
        </>
      }
    >
      <form id="customer-form" onSubmit={submit} noValidate>
        <Input
          label="Full name"
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
          error={errors.name}
          autoComplete="off"
        />
        <div className="form-grid">
          <Input
            label="Email"
            type="email"
            placeholder="name@example.com"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            error={errors.email}
            autoComplete="off"
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+91 9876543210"
            value={values.phone}
            onChange={(e) => setField("phone", e.target.value)}
            error={errors.phone}
            autoComplete="off"
          />
        </div>
        <p className="field__hint">
          The customer is added to zone <strong>{zoneName}</strong> and receives sign-in details by email (later
          phase). Assign meters from Meter Management.
        </p>
      </form>
    </Modal>
  );
}
