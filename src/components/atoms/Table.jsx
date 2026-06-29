import React from "react";
import Text from "@/components/atoms/Text";

/**
 * Table — A reusable table component optimized for clean data visualization.
 *
 * @param {Array<{key: string, label: string, align?: 'left'|'center'|'right', className?: string, render?: (row: any) => React.ReactNode}>} headers
 * @param {Array<any>} data
 * @param {boolean} loading
 * @param {string} emptyMessage
 * @param {function} onRowClick
 * @param {string} className
 */
export default function Table({
  headers = [],
  data = [],
  loading = false,
  emptyMessage = "Tidak ada data tersedia",
  onRowClick,
  className = "",
}) {
  const getAlignClass = (align) => {
    if (align === "right") return "text-right";
    if (align === "center") return "text-center";
    return "text-left";
  };

  return (
    <div className={`w-full ${className}`}>
      {/* ── MOBILE CARD LIST VIEW ── */}
      <div className="flex flex-col gap-4 md:hidden">
        {loading ? (
          Array.from({ length: 3 }).map((_, rIdx) => (
            <div key={rIdx} className="bg-white border border-zinc-200/80 rounded-[24px] p-5 shadow-sm animate-pulse space-y-4">
              {headers.map((header, hIdx) => (
                <div key={header.key || hIdx} className="space-y-1">
                  <div className="h-3 bg-zinc-100 rounded w-1/4" />
                  <div className="h-4 bg-zinc-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ))
        ) : data.length === 0 ? (
          <div className="bg-white border border-zinc-200/80 rounded-[24px] p-12 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5" />
              </svg>
            </div>
            <Text variant="body" color="muted" className="font-semibold text-zinc-400">
              {emptyMessage}
            </Text>
          </div>
        ) : (
          data.map((row, rIdx) => (
            <div
              key={row.id || rIdx}
              onClick={() => onRowClick && onRowClick(row)}
              className={`bg-white border border-zinc-200/85 rounded-[24px] p-5.5 shadow-sm space-y-4.5 transition-all ${
                onRowClick ? "cursor-pointer hover:border-[#ea580c]/30 hover:shadow-md active:scale-[0.99]" : ""
              }`}
            >
              {headers.map((header) => {
                const value = row[header.key];
                return (
                  <div key={header.key} className="flex flex-col gap-1 border-b border-zinc-100/50 pb-2.5 last:border-none last:pb-0">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      {header.label}
                    </span>
                    <div className="text-sm font-semibold text-zinc-800">
                      {header.render ? header.render(row) : (value !== undefined ? String(value) : "-")}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* ── DESKTOP TABLE VIEW ── */}
      <div className="hidden md:block w-full overflow-hidden bg-white border border-zinc-200/80 rounded-[24px] shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                {headers.map((header) => (
                  <th
                    key={header.key}
                    className={`py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider ${getAlignClass(
                      header.align
                    )} ${header.className || ""}`}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Loading Skeleton State
                Array.from({ length: 3 }).map((_, rIdx) => (
                  <tr key={rIdx} className="border-b border-zinc-50">
                    {headers.map((header, hIdx) => (
                      <td key={hIdx} className="py-5 px-6">
                        <div className="h-4 bg-zinc-100 rounded-lg animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={headers.length} className="py-12 px-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5" />
                        </svg>
                      </div>
                      <Text variant="body" color="muted" className="font-semibold text-zinc-400">
                        {emptyMessage}
                      </Text>
                    </div>
                  </td>
                </tr>
              ) : (
                // Row Rendering
                data.map((row, rIdx) => (
                  <tr
                    key={row.id || rIdx}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`border-b border-zinc-100/60 hover:bg-zinc-50/50 transition-colors last:border-none ${
                      onRowClick ? "cursor-pointer font-medium" : ""
                    }`}
                  >
                    {headers.map((header) => {
                      const value = row[header.key];
                      const alignClass = getAlignClass(header.align);
                      return (
                        <td
                          key={header.key}
                          className={`py-4.5 px-6 text-sm text-zinc-700 font-medium ${alignClass} ${header.className || ""}`}
                        >
                          {header.render ? (
                            header.render(row)
                          ) : (
                            <span className="text-zinc-800 font-semibold">{value !== undefined ? String(value) : "-"}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
