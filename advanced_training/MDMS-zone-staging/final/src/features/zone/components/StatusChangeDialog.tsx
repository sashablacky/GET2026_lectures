import ConfirmDialog from "../../../shared/components/feedback/ConfirmDialog";
import { useToast } from "../../../shared/components/feedback/toast-context";
import { NOT_SAVED_NOTE } from "../constants";

export interface StatusChangeTarget {
  kind: "meter" | "customer";
  id: string;
  name: string; // owner or customer name, shown in the message
  activate: boolean;
}

interface StatusChangeDialogProps {
  target: StatusChangeTarget | null;
  onClose: () => void;
}

// Confirmation for Activate / Deactivate row actions. Phase 1: nothing is saved.
export default function StatusChangeDialog({ target, onClose }: StatusChangeDialogProps) {
  const { showToast } = useToast();
  if (!target) return null;

  const verb = target.activate ? "Activate" : "Deactivate";
  const consequence =
    target.kind === "meter"
      ? target.activate
        ? "It will start reporting readings again."
        : "It will stop reporting readings and won't raise alerts."
      : target.activate
        ? "The customer will be able to sign in again."
        : "The customer won't be able to sign in. Their meters stay in the zone.";

  return (
    <ConfirmDialog
      open
      title={`${verb} ${target.kind}`}
      message={
        <>
          {verb} {target.kind} <strong>{target.id}</strong> ({target.name})? {consequence}
        </>
      }
      confirmLabel={verb}
      danger={!target.activate}
      onCancel={onClose}
      onConfirm={() => {
        showToast(`${verb} ${target.id} confirmed. ${NOT_SAVED_NOTE}`, "info");
        onClose();
      }}
    />
  );
}
