interface DialogProps { open: boolean; title: string; onClose: () => void }

export function Dialog({ open, title, onClose }: DialogProps) {
  if (!open) return null;
  return <dialog open aria-expanded={open}><h2>{title}</h2><button onClick={onClose}>x</button></dialog>;
}
