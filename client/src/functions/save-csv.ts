/**
 * @file save-csv.ts
 * @author Nicholas O'Sullivan
 */

/**
 * Convert a 2D array to CSV format.
 * @param data - The 2D array to convert.
 * @returns CSV string.
 */
export function arrayToCSV(data: string[][]): string {
    return data.map(row => row.map(item => `${item}`).join(",")).join("\n");
}

/**
 * Trigger a download of a file with the given content and filename.
 * @param content - The content (CSV string).
 * @param filename - The name of the file.
 */
export function downloadFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Download the spreadsheet as a CSV.
 * @param data - The 2D array spreadsheet.
 * @param filename - The name of the file.
 */
export function saveArrayAsCSV(data: string[][], filename: string = 'spreadsheet.csv') {
    const csv = arrayToCSV(data);
    downloadFile(csv, filename);
}
