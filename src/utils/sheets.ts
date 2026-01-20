import Papa from 'papaparse';
import fs from 'node:fs';
import path from 'node:path';

export interface MenuItem {
  Category: string;
  Name: string;
  Description: string;
  Price: string;
}

export interface MenuData {
  [category: string]: MenuItem[];
}

export async function getMenuData(): Promise<MenuData> {
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
      csvText = fs.readFileSync(localPath, 'utf-8');
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

  return grouped;
}
