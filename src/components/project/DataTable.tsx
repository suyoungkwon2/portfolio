// Generic responsive table for benchmark/comparison/before-after data —
// several case studies (AsleepTrack's accuracy benchmark, AI Search's
// A/B results, MARS's competition rounds) reduce cleanly to this shape.
export function DataTable({
  columns,
  rows,
  highlightRow,
}: {
  columns: string[];
  rows: (string | number)[][];
  highlightRow?: number;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-paper-2">
            {columns.map((col) => (
              <th
                key={col}
                className="font-display px-4 py-3 text-left font-medium text-ink"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-line last:border-0 ${
                i === highlightRow ? "bg-accent-soft/40" : ""
              }`}
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-ink-muted">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
