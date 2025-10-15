// FIX: Replaced the non-functional triple-slash directive for Vite client types with a manual global declaration for `import.meta.env`. This directly provides the necessary types for environment variables within the file, resolving TypeScript errors without relying on project-level type resolution.
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_SPREADSHEET_ID?: string;
      readonly VITE_GID?: string;
    }
  }
}

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Medicine } from '../types';
import { gvizResponseToRows, parseGvizText } from '../services/gvizService';
import { getHeaderMapping, mapRowsToMedicines } from '../utils/dataMapping';

interface MedicinesContextType {
  medicines: Medicine[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  headerMapping: Map<string, string>;
  reload: () => void;
  fetchNow: () => Promise<void>;
}

export const MedicinesContext = createContext<MedicinesContextType | undefined>(undefined);

const SPREADSHEET_ID = import.meta.env?.VITE_SPREADSHEET_ID || '1ZDO0G2YTgxcXrK-Zw4sBofPXtcdsvirrSs4fKdnZIQI';
const GID = import.meta.env?.VITE_GID || '0';
const CACHE_KEY = 'pharma_medicines_cache';
const CACHE_TTL = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

export const MedicinesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [headerMapping, setHeaderMapping] = useState<Map<string, string>>(new Map());

  const fetchAndProcessData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const text = await response.text();
      const gvizResponse = parseGvizText(text);
      const rows = gvizResponseToRows(gvizResponse);
      const mappedMedicines = mapRowsToMedicines(rows);

      const now = new Date();
      setMedicines(mappedMedicines);
      setLastUpdated(now);
      setHeaderMapping(getHeaderMapping());

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: now.getTime(),
        data: mappedMedicines,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error("Failed to fetch or process medicines data:", err);
      setError(errorMessage);
      // Fallback to cache if fetching fails
      loadFromCache(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFromCache = useCallback((isFallback: boolean = false) => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        const cacheAge = Date.now() - timestamp;

        if (cacheAge < CACHE_TTL || isFallback) {
          setMedicines(data);
          setLastUpdated(new Date(timestamp));
          // Re-run mapping logic to populate header map for admin page
          mapRowsToMedicines(data.map((m: Medicine) => m.raw || {})); 
          setHeaderMapping(getHeaderMapping());
          return true;
        }
      }
    } catch (e) {
      console.error("Failed to read from cache:", e);
    }
    return false;
  }, []);
  
  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
  }, []);


  useEffect(() => {
    const isCacheValid = loadFromCache();
    if (isCacheValid) {
      setLoading(false); // We have data, so we're not in an initial loading state
    } else {
      fetchAndProcessData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount


  const reload = useCallback(() => {
    clearCache();
    fetchAndProcessData();
  }, [clearCache, fetchAndProcessData]);


  const value = {
    medicines,
    loading,
    error,
    lastUpdated,
    headerMapping,
    reload,
    fetchNow: fetchAndProcessData,
  };

  return (
    <MedicinesContext.Provider value={value}>
      {children}
    </MedicinesContext.Provider>
  );
};
