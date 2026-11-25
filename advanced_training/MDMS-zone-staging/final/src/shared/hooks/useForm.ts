import { useState } from "react";
import type { FormEvent } from "react";

export type FormErrors<V> = Partial<Record<keyof V, string>>;

/**
 * Small form helper: errors appear after the first submit and then update
 * while the user types.
 */
export function useForm<V extends object>(initial: V, validate: (values: V) => FormErrors<V>) {
  const [values, setValues] = useState<V>(initial);
  const [errors, setErrors] = useState<FormErrors<V>>({});
  const [submitted, setSubmitted] = useState(false);

  const setField = <K extends keyof V>(field: K, value: V[K]) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  const handleSubmit = (onValid: (values: V) => void) => (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validate(values);
    setErrors(found);
    if (!Object.values(found).some(Boolean)) onValid(values);
  };

  const reset = (next: V = initial) => {
    setValues(next);
    setErrors({});
    setSubmitted(false);
  };

  return { values, errors, setField, handleSubmit, reset };
}
