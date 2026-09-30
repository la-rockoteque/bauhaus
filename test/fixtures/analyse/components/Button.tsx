import './Button.css';

interface ButtonProps {
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', disabled, loading, onClick, children }: ButtonProps) {
  return (
    <button className={`btn btn--${variant}`} disabled={disabled} aria-busy={loading} onClick={onClick}>
      {children}
    </button>
  );
}
