import { useId } from 'react';

export interface FieldIds {
  /** The control id, which the label points at. */
  id: string;
  descriptionId?: string;
  errorId?: string;
  successId?: string;
  /** Value for aria-describedby: the description, then the error or the success message. */
  describedBy?: string;
  /** A field is invalid exactly when it shows an error message. The message is the state; colour alone never is. */
  invalid: boolean;
}

/** One place that wires label, description and error to the control, so every field does it the same way. */
export function useFieldIds({ id, description, error, success }: { id?: string; description?: unknown; error?: unknown; success?: unknown }): FieldIds {
  const generated = useId();
  const base = id ?? generated;
  const descriptionId = description ? `${base}-description` : undefined;
  const errorId = error ? `${base}-error` : undefined;
  // An error wins: a field never shows both.
  const successId = success && !error ? `${base}-success` : undefined;
  return { id: base, descriptionId, errorId, successId, describedBy: [descriptionId, errorId, successId].filter(Boolean).join(' ') || undefined, invalid: Boolean(error) };
}
