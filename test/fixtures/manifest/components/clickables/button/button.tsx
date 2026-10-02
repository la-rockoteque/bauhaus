import { Box } from '../../../primitives/box/box';
import './button.css';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps {
  /** One primary per view region. */
  variant?: ButtonVariant;
  /** The action is running;
   *  presses are ignored. */
  loading?: boolean;
  onClick?: (event: MouseEvent) => void;
}

export function Button({ variant = 'primary', loading = false, onClick }: ButtonProps) {
  return <Box><button className="ac-button" onClick={onClick} /></Box>;
}
