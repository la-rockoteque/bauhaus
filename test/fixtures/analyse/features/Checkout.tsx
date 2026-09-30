import { Button } from '../components/Button';
import { SubmitButton } from '../components/SubmitButton';

export function Checkout({ onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <Button variant="ghost">Back</Button>
      <SubmitButton>Pay</SubmitButton>
      <p role="alert">Card declined</p>
    </form>
  );
}
