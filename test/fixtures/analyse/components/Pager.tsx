export function Pager({ page, onPage }: { page: number; onPage: (p: number) => void }) {
  return <nav><button onClick={() => onPage(page + 1)}>next</button></nav>;
}
