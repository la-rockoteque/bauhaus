import { useId } from 'react';

export interface FieldIds {
  /** The control id, which the label points at. */
  id: string;
  descriptionId?: string;
  errorId?: string;
  /** Value for aria-describedby: the description, then the error. */
  describedBy?: string;
  /** A field is invalid exactly when it shows an error message. The message is the state; colour alone never is. */
  invalid: boolean;
}

/** One place that wires label, description and error to the control, so every field does it the same way. */
export function useFieldIds({ id, description, error }: { id?: string; description?: unknown; error?: unknown }): FieldIds {
  const generated = useId();
  const base = id ?? generated;
  const descriptionId = description ? `${base}-description` : undefined;
  const errorId = error ? `${base}-error` : undefined;
  return { id: base, descriptionId, errorId, describedBy: [descriptionId, errorId].filter(Boolean).join(' ') || undefined, invalid: Boolean(error) };
}
