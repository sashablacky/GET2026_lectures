import { CircleAlert, RotateCcw, Save } from "lucide-react";
import PageHeader from "../../../shared/components/ui/PageHeader";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/forms/Input";
import Toggle from "../../../shared/components/forms/Toggle";
import EmptyState from "../../../shared/components/feedback/EmptyState";
import Loader from "../../../shared/components/feedback/Loader";
import { useToast } from "../../../shared/components/feedback/toast-context";
import { useApi } from "../../../shared/hooks/useApi";
import { useForm } from "../../../shared/hooks/useForm";
import { errorMessage } from "../../../shared/utils/format";
import { NOT_SAVED_NOTE } from "../constants";
import { useCurrentZone } from "../hooks/useCurrentZone";
import { getZoneSettings } from "../services/zoneService";
import { validateSettingsForm } from "../utils/validation";
import type { SettingsFormValues, ZoneSettings } from "../types/zone";
import "./zone.css";

const toFormValues = (s: ZoneSettings): SettingsFormValues => ({
  highConsumptionKwh: String(s.thresholds.highConsumptionKwh),
  lowConsumptionKwh: String(s.thresholds.lowConsumptionKwh),
  abnormalReadingsPerDay: String(s.thresholds.abnormalReadingsPerDay),
  inactiveMeterHours: String(s.thresholds.inactiveMeterHours),
  email: s.channels.email,
  sms: s.channels.sms,
  inApp: s.channels.inApp,
});

const unit = (text: string) => <span className="field__adornment field__unit">{text}</span>;

function SettingsForm({ settings }: { settings: ZoneSettings }) {
  const { showToast } = useToast();
  const initial = toFormValues(settings);
  const { values, errors, setField, handleSubmit, reset } = useForm<SettingsFormValues>(initial, validateSettingsForm);

  const submit = handleSubmit(() => showToast(`Settings are valid. ${NOT_SAVED_NOTE}`, "info"));

  return (
    <form className="page" onSubmit={submit} noValidate>
      <section className="card">
        <h2 className="card__title">Alert thresholds</h2>
        <p className="field__hint settings__intro">An alert is raised for a meter when a value crosses its threshold.</p>
        <div className="form-grid">
          <Input
            label="High consumption (per meter per day)"
            type="number"
            min={0}
            step="0.5"
            inputMode="decimal"
            value={values.highConsumptionKwh}
            onChange={(e) => setField("highConsumptionKwh", e.target.value)}
            error={errors.highConsumptionKwh}
            endAdornment={unit("kWh")}
          />
          <Input
            label="Low consumption (per meter per day)"
            type="number"
            min={0}
            step="0.5"
            inputMode="decimal"
            value={values.lowConsumptionKwh}
            onChange={(e) => setField("lowConsumptionKwh", e.target.value)}
            error={errors.lowConsumptionKwh}
            endAdornment={unit("kWh")}
          />
          <Input
            label="Abnormal reading frequency"
            type="number"
            min={1}
            step="1"
            inputMode="numeric"
            value={values.abnormalReadingsPerDay}
            onChange={(e) => setField("abnormalReadingsPerDay", e.target.value)}
            error={errors.abnormalReadingsPerDay}
            endAdornment={unit("per day")}
          />
          <Input
            label="Inactive meter after"
            type="number"
            min={1}
            step="1"
            inputMode="numeric"
            value={values.inactiveMeterHours}
            onChange={(e) => setField("inactiveMeterHours", e.target.value)}
            error={errors.inactiveMeterHours}
            endAdornment={unit("hours")}
          />
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">Notification channels</h2>
        <Toggle
          label="Email"
          description="Send zone alerts to the admin's email."
          checked={values.email}
          onChange={(v) => setField("email", v)}
        />
        <Toggle label="SMS" description="Send critical alerts by SMS." checked={values.sms} onChange={(v) => setField("sms", v)} />
        <Toggle
          label="In-app"
          description="Show alerts under the bell icon."
          checked={values.inApp}
          onChange={(v) => setField("inApp", v)}
        />
        {errors.inApp && (
          <p className="field__error" role="alert">
            {errors.inApp}
          </p>
        )}
      </section>

      <div className="row settings__actions">
        <Button icon={<RotateCcw size={16} />} onClick={() => reset(initial)}>
          Reset changes
        </Button>
        <Button variant="primary" type="submit" icon={<Save size={16} />}>
          Save settings
        </Button>
      </div>
    </form>
  );
}

export default function Settings() {
  const { zoneId, zoneName } = useCurrentZone();
  const settings = useApi((s) => getZoneSettings(zoneId, s), `zone-settings:${zoneId}`);

  let content;
  if (settings.loading) content = <Loader label="Loading settings…" />;
  else if (!settings.data)
    content = (
      <div className="card">
        <EmptyState
          tone="error"
          icon={<CircleAlert size={28} />}
          title="Could not load settings"
          message={errorMessage(settings.error)}
        />
      </div>
    );
  else content = <SettingsForm key={settings.data.id} settings={settings.data} />;

  return (
    <div className="page">
      <PageHeader title="Zone settings" subtitle={`Alert rules for zone ${zoneName}`} />
      {content}
    </div>
  );
}
