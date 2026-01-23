import Papa from 'papaparse';
import fs from 'node:fs';
import path from 'node:path';
import type { ThemeKey } from '../themes';

// --- Vibe Override Types ---
export type VibeOverrideMode = 'AUTO' | 'FORCE_SOMBER' | 'FORCE_PARTY' | 'FORCE_COZY' | 'FORCE_VICTORY';

export interface VibeOverrideRow {
  Active: string;          // "TRUE" or "FALSE"
  Mode: VibeOverrideMode;
  Message: string;         // Optional custom message
  ExpiresAt: string;       // ISO date string or empty
}

let vibeCache: { data: VibeOverrideRow | null; timestamp: number } | null = null;
const VIBE_CACHE_TTL = 60_000; // 1 minute

export async function getVibeOverride(): Promise<VibeOverrideRow | null> {
  if (vibeCache && Date.now() - vibeCache.timestamp < VIBE_CACHE_TTL) {
    return vibeCache.data;
  }

  const csvUrl = import.meta.env.VIBE_CSV_URL;
  let csvText = '';

  if (csvUrl) {
    try {
      const response = await fetch(csvUrl);
      if (!response.ok) throw new Error(`Failed to fetch vibe CSV: ${response.statusText}`);
      csvText = await response.text();
    } catch (error) {
      console.error('Error fetching vibe CSV:', error);
      vibeCache = { data: null, timestamp: Date.now() };
      return null;
    }
  } else {
    // Fallback to local file
    try {
      const localPath = path.resolve('./public/vibe_override.csv');
      csvText = await fs.promises.readFile(localPath, 'utf-8');
    } catch {
      // No override file exists, that's fine
      vibeCache = { data: null, timestamp: Date.now() };
      return null;
    }
  }

  const { data } = Papa.parse<VibeOverrideRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  // Find the first active, non-expired override
  const now = new Date();
  const activeOverride = data.find((row: VibeOverrideRow) => {
    if (row.Active?.toUpperCase() !== 'TRUE') return false;
    if (row.ExpiresAt) {
      const expires = new Date(row.ExpiresAt);
      if (expires < now) return false;
    }
    return true;
  });

  vibeCache = { data: activeOverride ?? null, timestamp: Date.now() };
  return vibeCache.data;
}

export interface MenuItem {
  Category: string;
  Name: string;
  Description: string;
  Price: string;
}

export interface MenuData {
  [category: string]: MenuItem[];
}

let cachedData: MenuData | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 60_000; // 1 minute

export async function getMenuData(): Promise<MenuData> {
  if (cachedData && Date.now() - lastFetchTime < CACHE_TTL) {
    return cachedData;
  }

  const csvUrl = import.meta.env.MENU_CSV_URL;
  let csvText = '';

  if (csvUrl) {
    try {
      console.log(`Fetching menu from ${csvUrl}`);
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`);
      }
      csvText = await response.text();
    } catch (error) {
      console.error('Error fetching CSV from URL:', error);
      // Fallback or rethrow? Let's rethrow or return empty to avoid silent failures in prod
      throw error;
    }
  } else {
    // Fallback to local file in public/menu.csv
    // This works in Node context (Astro build/dev server)
    try {
      console.log('No MENU_CSV_URL provided, reading from public/menu.csv');
      const localPath = path.resolve('./public/menu.csv');
      csvText = await fs.promises.readFile(localPath, 'utf-8');
    } catch (error) {
      console.error('Error reading local CSV:', error);
      return {};
    }
  }

  const { data, errors } = Papa.parse<MenuItem>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length > 0) {
    console.warn('CSV Parsing errors:', errors);
  }

  // Group by Category
  const grouped = data.reduce((acc, item) => {
    const category = item.Category?.trim();
    if (category) {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
    }
    return acc;
  }, {} as MenuData);

  cachedData = grouped;
  lastFetchTime = Date.now();

  return grouped;
}
