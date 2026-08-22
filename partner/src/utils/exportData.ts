type Row = (string | number)[];

function download(content: string, fileName: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function toCsv(headers: string[], rows: Row[]): string {
  return [headers, ...rows].
  map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).
  join('\n');
}

export function exportCsv(fileName: string, headers: string[], rows: Row[]) {
  download(toCsv(headers, rows), `${fileName}.csv`, 'text/csv;charset=utf-8;');
}

/** Excel opens a tab-separated .xls cleanly, which keeps this client-side and dependency-free. */
export function exportExcel(fileName: string, headers: string[], rows: Row[]) {
  const content = [headers, ...rows].map((row) => row.join('\t')).join('\n');
  download(content, `${fileName}.xls`, 'application/vnd.ms-excel');
}

/** PDF export uses the browser print dialog, where "Save as PDF" is the destination. */
export function exportPdf() {
  window.print();
}