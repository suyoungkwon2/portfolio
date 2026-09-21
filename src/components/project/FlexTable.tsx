// A sibling to DataTable for rows that need rich cell content (bulleted
// lists, links) and fixed-width leading columns — DataTable's semantic
// <table> forces equal-ish column sizing and plain string cells, which
// doesn't fit these two comparison tables.
export type FlexColumn = { label: string; width?: number };

export function FlexTable({
  columns,
  rows,
  highlightRow,
}: {
  columns: FlexColumn[];
  rows: React.ReactNode[][];
  highlightRow?: number;
}) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-line text-sm">
      <div className="flex gap-4 border-b border-line bg-paper-2 px-4 py-3 font-medium text-ink">
        {columns.map((col, i) => (
          <div
            key={col.label}
            className={i === columns.length - 1 ? "flex-1" : "shrink-0"}
            style={i !== columns.length - 1 ? { width: col.width } : undefined}
          >
            {col.label}
          </div>
        ))}
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className={`flex gap-4 px-4 py-3 leading-relaxed text-ink-muted ${
            i === rows.length - 1 ? "" : "border-b border-line"
          } ${i === highlightRow ? "bg-accent-soft/40" : ""}`}
        >
          {row.map((cell, j) => (
            <div
              key={j}
              className={j === row.length - 1 ? "flex-1" : "shrink-0"}
              style={j !== row.length - 1 ? { width: columns[j]?.width } : undefined}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
