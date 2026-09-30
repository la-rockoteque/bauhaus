import { FilterBar } from '../components/FilterBar';
import { Table } from '../components/Table';
import { Pager } from '../components/Pager';

export function Customers({ rows }) {
  if (rows.length === 0) return <p>Aucun client</p>;
  return (
    <div role="main">
      <FilterBar filters={['a']} onChange={() => {}} />
      <Table rows={rows} />
      <Pager page={2} onPage={() => {}} />
    </div>
  );
}
