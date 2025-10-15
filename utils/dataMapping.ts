
import type { Availability, Medicine } from '../types';

const normalizeHeader = (header: string): string => {
  return header.toLowerCase().replace(/[^a-z0-9]/g, '');
};

// FIX: The type for the values of MAPPING was corrected from `(keyof Medicine)[]` to `string[]`.
// The arrays contain possible spreadsheet header names (strings), not keys of the Medicine type.
const MAPPING: Record<string, string[]> = {
  id: ['sl', 'id', 'serialnumber'],
  name: ['productname', 'medicinename', 'name'],
  genericName: ['genericname', 'composition'],
  brand: ['marketer', 'brand'],
  category: ['category', 'group'],
  manufacturer: ['manufacturer', 'mfg'],
  description: ['description'],
  dosage: ['dosage'],
  form: ['form', 'packtype'],
  price: ['mrp', 'rate', 'price'],
  stock: ['stock', 'quantity', 'qty'],
  prescription: ['prescription', 'rx'],
  imageUrl: ['imageurl', 'image', 'img'],
  uses: ['uses', 'indications'],
  sideEffects: ['sideeffects'],
  contraindications: ['contraindications'],
};

const REVERSE_MAPPING = new Map<string, keyof Medicine>();
const MAPPED_HEADERS = new Map<string, string>();

const buildReverseMapping = (headers: string[]) => {
    REVERSE_MAPPING.clear();
    MAPPED_HEADERS.clear();
    const normalizedHeaders = headers.map(h => ({ original: h, normalized: normalizeHeader(h) }));

    for (const [field, possibleNames] of Object.entries(MAPPING)) {
        for (const name of possibleNames) {
            const match = normalizedHeaders.find(h => h.normalized === name);
            if (match) {
                REVERSE_MAPPING.set(match.original, field as keyof Medicine);
                MAPPED_HEADERS.set(field, match.original);
                break; // First match wins
            }
        }
    }
};

export const getHeaderMapping = (): Map<string, string> => MAPPED_HEADERS;

const getAvailability = (stock: number): Availability => {
  if (stock > 20) return "In Stock";
  if (stock > 0) return "Low Stock";
  return "Out of Stock";
};

const toBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    return lower === 'y' || lower === 'yes' || lower === 'true' || lower === '1';
  }
  return !!value;
};

const toSplitArray = (value: any): string[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim()) {
        return value.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
};

const toSafeNumber = (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
}

export const mapRowsToMedicines = (rows: Record<string, any>[]): Medicine[] => {
    if (rows.length === 0) return [];

    const headers = Object.keys(rows[0]);
    buildReverseMapping(headers);

    return rows.map((row, index) => fromSheetRow(row, index + 1));
}

const fromSheetRow = (row: Record<string, any>, index: number): Medicine => {
  const medicine: Partial<Medicine> & { raw: Record<string, any> } = { raw: row };

  for (const [header, value] of Object.entries(row)) {
    const field = REVERSE_MAPPING.get(header);
    if (field) {
      (medicine as any)[field] = value;
    }
  }

  const stock = toSafeNumber(medicine.stock);
  const price = toSafeNumber(medicine.price);

  return {
    id: medicine.id?.toString() || `${normalizeHeader(medicine.name || `med-${index}`)}`,
    name: medicine.name || 'Unknown Medicine',
    genericName: medicine.genericName || 'N/A',
    brand: medicine.brand || 'N/A',
    category: medicine.category || 'Uncategorized',
    manufacturer: medicine.manufacturer || medicine.brand || 'N/A',
    description: medicine.description || '',
    dosage: medicine.dosage || '',
    form: medicine.form || '',
    price: price,
    stock: stock,
    availability: getAvailability(stock),
    prescription: toBoolean(medicine.prescription),
    imageUrl: medicine.imageUrl || undefined,
    uses: toSplitArray(medicine.uses),
    sideEffects: toSplitArray(medicine.sideEffects),
    contraindications: toSplitArray(medicine.contraindications),
    raw: row,
  };
};
