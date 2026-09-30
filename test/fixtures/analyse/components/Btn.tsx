export const Btn = ({ variant, disabled, loading, onClick, children }: { variant?: string; disabled?: boolean; loading?: boolean; onClick?: () => void; children: React.ReactNode }) => (
  <button className="btn" style={{ color: '#1e2836', padding: '5px 13px' }} disabled={disabled} onClick={onClick}>
    {children}
  </button>
);
