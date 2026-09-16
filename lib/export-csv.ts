/**
 * Reusable CSV Export Utility for Ananda Yoga Studio LMS Demo.
 * 
 * Complies with RFC 4180:
 * - Prepends UTF-8 BOM (\uFEFF) for Excel compatibility
 * - Escapes double quotes by doubling them (" -> "")
 * - Encloses fields containing commas, double quotes, or newlines in double quotes
 * - Handles undefined / null cleanly
 * - Formats dates, arrays, and numbers consistently
 * - Triggers client-side browser file download
 */

export interface CsvColumn<T> {
  header: string;
  accessor: (item: T) => string | number | boolean | null | undefined;
}

/**
 * Cleanly format and escape a single CSV field.
 */
function escapeCsvValue(val: unknown): string {
  if (val === null || val === undefined) {
    return "";
  }

  // Handle arrays
  if (Array.isArray(val)) {
    return escapeCsvValue(val.join("; "));
  }

  // Handle objects (avoid [object Object])
  if (typeof val === "object" && !(val instanceof Date)) {
    return escapeCsvValue(JSON.stringify(val));
  }

  // Handle Dates
  if (val instanceof Date) {
    return escapeCsvValue(val.toISOString());
  }

  const str = String(val);

  // If contains commas, double-quotes, or line breaks, enclose in quotes & escape quotes
  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Generate a CSV string from a dataset and column definitions.
 */
export function generateCsv<T>(columns: CsvColumn<T>[], data: T[]): string {
  const headerRow = columns.map((col) => escapeCsvValue(col.header)).join(",");
  const rows = data.map((item) =>
    columns.map((col) => escapeCsvValue(col.accessor(item))).join(",")
  );

  // Return UTF-8 BOM + Header + Rows
  return "\uFEFF" + [headerRow, ...rows].join("\r\n");
}

/**
 * Trigger browser file download of CSV content.
 */
export function downloadCsv(filename: string, csvContent: string): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format today's date in YYYY-MM-DD for standard filenames.
 */
export function getExportDateStamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * High-level export function: validates data length, generates CSV, and initiates download.
 * Returns true if export succeeded, or false if there was no data to export.
 */
export function exportToCsv<T>(
  section: string,
  columns: CsvColumn<T>[],
  data: T[]
): { success: boolean; message?: string } {
  if (!data || data.length === 0) {
    return {
      success: false,
      message: "There is no data available to export.",
    };
  }

  const filename = `ananda-${section}-${getExportDateStamp()}.csv`;
  const csv = generateCsv(columns, data);
  downloadCsv(filename, csv);

  return { success: true };
}
