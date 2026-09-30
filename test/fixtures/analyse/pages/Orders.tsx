import { FilterBar } from '../components/FilterBar';
import { Table } from '../components/Table';
import { Pager } from '../components/Pager';
import { Button } from '../components/Button';
import { Spinner } from '../components/Spinner';

export function Orders({ rows, isLoading }) {
  if (isLoading) return <Spinner />;
  if (rows.length === 0) return <p>No results</p>;
  return (
    <div>
      <FilterBar filters={[]} onChange={() => {}} />
      <Table rows={rows} />
      <Pager page={1} onPage={() => {}} />
      <Button>Export</Button>
    </div>
  );
}
