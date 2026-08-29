/**
 * Real file generation for AdminOS exports. Every export builds a Blob from
 * the rows currently on screen and triggers a genuine browser download —
 * CSV, Excel (SpreadsheetML, opens natively in Excel) and PDF.
 */
import { jsPDF } from 'jspdf';

export type ExportFormat = 'CSV' | 'Excel' | 'PDF';

export interface ExportColumn<T> {
  header: string;
  value: (row: T) => string | number;
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function slug(input: string): string {
  return input.
  toLowerCase().
  replace(/[^a-z0-9]+/g, '-').
  replace(/^-|-$/g, '');
}

function stamp(): string {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(
    now.getHours()
  ).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
}

function escapeCsv(value: string | number): string {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function escapeXml(value: string | number): string {
  return String(value ?? '').
  replace(/&/g, '&amp;').
  replace(/</g, '&lt;').
  replace(/>/g, '&gt;').
  replace(/"/g, '&quot;');
}

function toCsv<T>(columns: ExportColumn<T>[], rows: T[]): string {
  const head = columns.map((column) => escapeCsv(column.header)).join(',');
  const body = rows.map((row) => columns.map((column) => escapeCsv(column.value(row))).join(','));
  return [head, ...body].join('\r\n');
}

function toSpreadsheetMl<T>(title: string, columns: ExportColumn<T>[], rows: T[]): string {
  const headCells = columns.
  map((column) => `<Cell ss:StyleID="head"><Data ss:Type="String">${escapeXml(column.header)}</Data></Cell>`).
  join('');
  const bodyRows = rows.
  map((row) => {
    const cells = columns.
    map((column) => {
      const raw = column.value(row);
      const numeric = typeof raw === 'number' && Number.isFinite(raw);
      return `<Cell><Data ss:Type="${numeric ? 'Number' : 'String'}">${escapeXml(raw)}</Data></Cell>`;
    }).
    join('');
    return `<Row>${cells}</Row>`;
  }).
  join('');

  return `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="head"><Font ss:Bold="1"/><Interior ss:Color="#D9F27E" ss:Pattern="Solid"/></Style>
  </Styles>
  <Worksheet ss:Name="${escapeXml(title).slice(0, 28)}">
    <Table>
      <Row>${headCells}</Row>
      ${bodyRows}
    </Table>
  </Worksheet>
</Workbook>`;
}

function toPdf<T>(title: string, subtitle: string, columns: ExportColumn<T>[], rows: T[]): Blob {
  const doc = new jsPDF({ orientation: columns.length > 5 ? 'landscape' : 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const usable = pageWidth - margin * 2;
  const colWidth = usable / columns.length;

  function header() {
    doc.setFillColor(17, 18, 16);
    doc.rect(0, 0, pageWidth, 58, 'F');
    doc.setTextColor(217, 242, 126);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('CHECKDIN AdminOS', margin, 26);
    doc.setTextColor(235, 235, 235);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`${title} — ${subtitle}`, margin, 42);
    doc.setTextColor(20, 20, 20);
  }

  function tableHead(y: number) {
    doc.setFillColor(242, 242, 238);
    doc.rect(margin, y - 12, usable, 18, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    columns.forEach((column, index) => {
      doc.text(String(column.header).slice(0, 24), margin + index * colWidth + 4, y);
    });
    doc.setFont('helvetica', 'normal');
  }

  header();
  let y = 88;
  tableHead(y);
  y += 20;

  doc.setFontSize(8);
  rows.forEach((row) => {
    if (y > pageHeight - margin) {
      doc.addPage();
      header();
      y = 88;
      tableHead(y);
      y += 20;
    }
    columns.forEach((column, index) => {
      const text = String(column.value(row) ?? '');
      doc.text(text.slice(0, Math.max(8, Math.floor(colWidth / 4.4))), margin + index * colWidth + 4, y);
    });
    doc.setDrawColor(230, 230, 226);
    doc.line(margin, y + 5, margin + usable, y + 5);
    y += 18;
  });

  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `${rows.length} rows · generated ${new Date().toLocaleString('en-IN')} · Checkdin AdminOS`,
    margin,
    pageHeight - 18
  );

  return doc.output('blob');
}

/** Generates and downloads a real file for the given rows. Returns the file name. */
export function exportRows<T>(options: {
  format: ExportFormat;
  title: string;
  subtitle?: string;
  columns: ExportColumn<T>[];
  rows: T[];
}): string {
  const { format, title, subtitle = 'Checkdin marketplace export', columns, rows } = options;
  const base = `checkdin-${slug(title)}-${stamp()}`;

  if (format === 'CSV') {
    const fileName = `${base}.csv`;
    triggerDownload(new Blob(['\uFEFF', toCsv(columns, rows)], { type: 'text/csv;charset=utf-8' }), fileName);
    return fileName;
  }

  if (format === 'Excel') {
    const fileName = `${base}.xls`;
    triggerDownload(
      new Blob([toSpreadsheetMl(title, columns, rows)], { type: 'application/vnd.ms-excel;charset=utf-8' }),
      fileName
    );
    return fileName;
  }

  const fileName = `${base}.pdf`;
  triggerDownload(toPdf(title, subtitle, columns, rows), fileName);
  return fileName;
}