import { Button } from './Button';

export function SubmitButton({ disabled, loading, children }) {
  return <Button variant="primary" disabled={disabled} loading={loading}>{children}</Button>;
}
