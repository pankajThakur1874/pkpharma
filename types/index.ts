
export type Availability = "In Stock" | "Low Stock" | "Out of Stock";

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  category: string;
  manufacturer: string;
  description: string;
  dosage: string;
  form: string;
  price: number;
  stock: number;
  availability: Availability;
  prescription: boolean;
  imageUrl?: string;
  uses: string[];
  sideEffects: string[];
  contraindications: string[];
  raw?: Record<string, any>;
}

export interface GvizCol {
    id: string;
    label: string;
    type: string;
}

export interface GvizCell {
    v?: any;
    f?: string;
}

export interface GvizRow {
    c: (GvizCell | null)[];
}

export interface GvizTable {
    cols: GvizCol[];
    rows: GvizRow[];
}

export interface GvizResponse {
    version: string;
    reqId: string;
    status: string;
    sig: string;
    table: GvizTable;
}
