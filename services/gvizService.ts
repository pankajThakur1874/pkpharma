
import type { GvizResponse } from '../types';

/**
 * Parses the JSONP text from a Google Sheets GViz API response.
 * It strips the "google.visualization.Query.setResponse(" wrapper and the trailing ");".
 * @param text The raw response text from the GViz endpoint.
 * @returns The parsed JSON object.
 */
export const parseGvizText = (text: string): GvizResponse => {
  const jsonText = text
    .replace('/*O_o*/', '')
    .replace('google.visualization.Query.setResponse(', '')
    .slice(0, -2);
  try {
    return JSON.parse(jsonText);
  } catch (e) {
    console.error('Failed to parse GViz response:', e);
    throw new Error('Invalid GViz response format.');
  }
};

/**
 * Converts a GViz response table into an array of row objects with headers.
 * It uses column labels as keys for the row objects.
 * @param gvizResponse The parsed GViz response object.
 * @returns An array of objects, where each object represents a row.
 */
export const gvizResponseToRows = (gvizResponse: GvizResponse): Record<string, any>[] => {
  if (gvizResponse.status !== 'ok' || !gvizResponse.table) {
    throw new Error('GViz response indicates an error or contains no table.');
  }

  const { cols, rows } = gvizResponse.table;
  const headers = cols.map(col => col.label || col.id).filter(Boolean);

  return rows.map(row => {
    const rowObject: Record<string, any> = {};
    row.c.forEach((cell, index) => {
      const header = headers[index];
      if (header) {
        // Prefer formatted value (f), fallback to raw value (v)
        rowObject[header] = cell?.f ?? cell?.v;
      }
    });
    return rowObject;
  });
};
