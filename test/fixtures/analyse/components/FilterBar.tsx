export function FilterBar({ filters, onChange }: { filters: string[]; onChange: () => void }) {
  return <div className="filter-bar" onChange={onChange}>{filters.join(',')}</div>;
}
