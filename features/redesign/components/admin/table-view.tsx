import type { TableColumn } from "../../types";

type Primitive = string | number | boolean | null | undefined;

type TableViewProps<T extends Record<string, Primitive>> = {
  title: string;
  columns: Array<TableColumn<T>>;
  rows: T[];
};

export function TableView<T extends Record<string, Primitive>>({ title, columns, rows }: TableViewProps<T>) {
  return (
    <section className="phx-card" aria-label={title}>
      <h2 className="phx-heading-sm mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2 text-left">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id} className="px-3 py-2 text-xs uppercase tracking-[0.08em] text-ph-nav/70">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="rounded-xl bg-ph-surface/55">
                {columns.map((column) => (
                  <td key={column.id} className="px-3 py-3 align-top phx-body-sm">
                    {String(row[column.id] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
