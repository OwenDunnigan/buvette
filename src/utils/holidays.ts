import type { ThemeKey } from '../themes';

export interface HolidayContext {
    isHoliday: boolean;
    holidayName: string | null;
    recommendedTheme: ThemeKey | null;
    isBlackout: boolean; // Supersedes holiday themes (e.g., Remembrance Day)
}

interface HolidayDef {
    name: string;
    theme: ThemeKey | null;
    isBlackout?: boolean;
}

// Winnipeg-specific holidays and observances
// Format: "MM-DD" for fixed dates
const FIXED_HOLIDAYS: Record<string, HolidayDef> = {
    // Blackout dates (no fun themes)
    '11-11': { name: 'Remembrance Day', theme: 'NEUTRAL_RESPECTFUL', isBlackout: true },
    '09-30': { name: 'Truth & Reconciliation Day', theme: 'NEUTRAL_RESPECTFUL', isBlackout: true },

    // Festive dates
    '12-24': { name: 'Christmas Eve', theme: 'CHRISTMAS' },
    '12-25': { name: 'Christmas Day', theme: 'CHRISTMAS' },
    '12-26': { name: 'Boxing Day', theme: 'CHRISTMAS' },
    '12-31': { name: "New Year's Eve", theme: 'MANIC_PARTY' },
    '01-01': { name: "New Year's Day", theme: 'HYGGE_MODE' },
    '02-14': { name: "Valentine's Day", theme: 'VALENTINES' },
    '10-31': { name: "Halloween", theme: 'HALLOWEEN' },
    '07-01': { name: 'Canada Day', theme: 'CANADA_DAY' },

    // Winnipeg-specific events (approximate)
    '02-15': { name: 'Louis Riel Day', theme: 'HYGGE_MODE' }, // MB Holiday (3rd Monday Feb, ~Feb 15)

    // Global / Cultural events
    '06-12': { name: 'Philippine Independence Day', theme: 'MABUHAY' },
    '04-13': { name: 'Vaisakhi', theme: 'PRAIRIE_GOLD' },
};

// Movable cultural and religious holidays (2024 - 2035)
// Dates for Lunar New Year, Diwali, Holi, and Eid al-Fitr
const MOVABLE_HOLIDAYS: Record<number, Record<string, HolidayDef>> = {
    2024: {
        '02-10': { name: 'Lunar New Year', theme: 'LUNAR_NEW_YEAR' },
        '03-25': { name: 'Holi', theme: 'HOLI' },
        '04-10': { name: 'Eid al-Fitr', theme: 'EID' },
        '10-31': { name: 'Diwali', theme: 'DIWALI' },
    },
    2025: {
        '01-29': { name: 'Lunar New Year', theme: 'LUNAR_NEW_YEAR' },
        '03-14': { name: 'Holi', theme: 'HOLI' },
        '03-30': { name: 'Eid al-Fitr', theme: 'EID' },
        '10-20': { name: 'Diwali', theme: 'DIWALI' },
    },
    2026: {
        '02-17': { name: 'Lunar New Year', theme: 'LUNAR_NEW_YEAR' },
        '03-03': { name: 'Holi', theme: 'HOLI' },
        '03-20': { name: 'Eid al-Fitr', theme: 'EID' },
        '11-08': { name: 'Diwali', theme: 'DIWALI' },
    },
    2027: {
        '02-06': { name: 'Lunar New Year', theme: 'LUNAR_NEW_YEAR' },
        '03-22': { name: 'Holi', theme: 'HOLI' },
        '03-09': { name: 'Eid al-Fitr', theme: 'EID' },
        '10-29': { name: 'Diwali', theme: 'DIWALI' },
    },
    2028: {
        '01-26': { name: 'Lunar New Year', theme: 'LUNAR_NEW_YEAR' },
        '03-11': { name: 'Holi', theme: 'HOLI' },
        '02-26': { name: 'Eid al-Fitr', theme: 'EID' },
        '10-17': { name: 'Diwali', theme: 'DIWALI' },
    },
    2029: {
        '02-13': { name: 'Lunar New Year', theme: 'LUNAR_NEW_YEAR' },
        '02-28': { name: 'Holi', theme: 'HOLI' },
        '02-14': { name: 'Eid al-Fitr', theme: 'EID' },
        '11-05': { name: 'Diwali', theme: 'DIWALI' },
    },
    2030: {
        '02-03': { name: 'Lunar New Year', theme: 'LUNAR_NEW_YEAR' },
        '03-19': { name: 'Holi', theme: 'HOLI' },
        '02-04': { name: 'Eid al-Fitr', theme: 'EID' },
        '10-26': { name: 'Diwali', theme: 'DIWALI' },
    },
    2031: {
        '01-23': { name: 'Lunar New Year', theme: 'LUNAR_NEW_YEAR' },
        '03-08': { name: 'Holi', theme: 'HOLI' },
        '01-24': { name: 'Eid al-Fitr', theme: 'EID' },
        '11-14': { name: 'Diwali', theme: 'DIWALI' },
    },
    2032: {
        '02-11': { name: 'Lunar New Year', theme: 'LUNAR_NEW_YEAR' },
        '03-26': { name: 'Holi', theme: 'HOLI' },
        '01-13': { name: 'Eid al-Fitr', theme: 'EID' },
        '11-02': { name: 'Diwali', theme: 'DIWALI' },
    },
    2033: {
        '01-31': { name: 'Lunar New Year', theme: 'LUNAR_NEW_YEAR' },
        '03-15': { name: 'Holi', theme: 'HOLI' },
        '12-21': { name: 'Eid al-Fitr', theme: 'EID' },
        '10-22': { name: 'Diwali', theme: 'DIWALI' },
    },
    2034: {
        '02-19': { name: 'Lunar New Year', theme: 'LUNAR_NEW_YEAR' },
        '03-04': { name: 'Holi', theme: 'HOLI' },
        '12-11': { name: 'Eid al-Fitr', theme: 'EID' },
        '11-10': { name: 'Diwali', theme: 'DIWALI' },
    },
    2035: {
        '02-08': { name: 'Lunar New Year', theme: 'LUNAR_NEW_YEAR' },
        '03-24': { name: 'Holi', theme: 'HOLI' },
        '11-30': { name: 'Eid al-Fitr', theme: 'EID' },
        '10-30': { name: 'Diwali', theme: 'DIWALI' },
    }
};

// Range-based holidays (week-long events)
interface HolidayRange {
    name: string;
    theme: ThemeKey | null;
    startMonth: number; // 0-indexed
    startDay: number;
    endMonth: number;
    endDay: number;
}

const HOLIDAY_RANGES: HolidayRange[] = [
    // Festival du Voyageur (mid-February, ~10 days)
    { name: 'Festival du Voyageur', theme: 'COZY_SOMBER', startMonth: 1, startDay: 14, endMonth: 1, endDay: 23 },
    // Fringe Festival (mid-July, ~12 days)
    { name: 'Fringe Festival', theme: 'MANIC_PARTY', startMonth: 6, startDay: 15, endMonth: 6, endDay: 27 },
    // Folk Fest (mid-July, ~4 days)
    { name: 'Winnipeg Folk Festival', theme: 'PRAIRIE_GOLD', startMonth: 6, startDay: 8, endMonth: 6, endDay: 11 },
];

function formatDateKey(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
}

function isInRange(date: Date, range: HolidayRange): boolean {
    const month = date.getMonth();
    const day = date.getDate();

    // START and END in SAME month (e.g., Feb 14-23)
    if (range.startMonth === range.endMonth) {
        return month === range.startMonth && day >= range.startDay && day <= range.endDay;
    }

    // SPANNING months (e.g., Dec 25 - Jan 5)
    // 1. Middle months (fully included)
    if (month > range.startMonth && month < range.endMonth) return true;

    // 2. Start month (from startDay onwards)
    if (month === range.startMonth && day >= range.startDay) return true;

    // 3. End month (until endDay)
    if (month === range.endMonth && day <= range.endDay) return true;

    return false;
}

function getThanksgivingDate(year: number): Date {
    // Thanksgiving in Canada is the 2nd Monday of October
    const oct1 = new Date(year, 9, 1); // Oct is month 9 (0-indexed)
    const dayOfWeek = oct1.getDay(); // 0=Sun, 1=Mon...
    const offset = (dayOfWeek === 1) ? 0 : (8 - dayOfWeek) % 7;
    // oct1 + offset = 1st Monday. 1st Monday + 7 days = 2nd Monday.
    const thanksgivingDay = 1 + offset + 7;
    return new Date(year, 9, thanksgivingDay);
}

export function getAllHolidayNames(): string[] {
    const names = new Set<string>();

    // Fixed holidays
    Object.values(FIXED_HOLIDAYS).forEach(h => names.add(h.name));

    // Movable holidays
    Object.values(MOVABLE_HOLIDAYS).forEach(yearHolidays => {
        Object.values(yearHolidays).forEach(h => names.add(h.name));
    });

    // Range holidays
    HOLIDAY_RANGES.forEach(r => names.add(r.name));

    // Dynamic holidays
    names.add('Thanksgiving');

    return Array.from(names).sort();
}

export function getHolidayContext(date: Date = new Date(), mockName?: string): HolidayContext {
    // If mockName is provided, find the holiday by name and return its context
    if (mockName) {
        // Check fixed
        const fixed = Object.values(FIXED_HOLIDAYS).find(h => h.name === mockName);
        if (fixed) return { isHoliday: true, holidayName: fixed.name, recommendedTheme: fixed.theme, isBlackout: fixed.isBlackout ?? false };

        // Check movable
        for (const yearHolidays of Object.values(MOVABLE_HOLIDAYS)) {
            const movable = Object.values(yearHolidays).find(h => h.name === mockName);
            if (movable) return { isHoliday: true, holidayName: movable.name, recommendedTheme: movable.theme, isBlackout: movable.isBlackout ?? false };
        }

        // Check ranges
        const range = HOLIDAY_RANGES.find(r => r.name === mockName);
        if (range) return { isHoliday: true, holidayName: range.name, recommendedTheme: range.theme, isBlackout: false };

        // Check Thanksgiving
        if (mockName === 'Thanksgiving') return { isHoliday: true, holidayName: 'Thanksgiving', recommendedTheme: 'AUTUMN', isBlackout: false };
    }

    const dateKey = formatDateKey(date);

    // 0. Check Dynamic Holidays (Thanksgiving)
    const thanksgiving = getThanksgivingDate(date.getFullYear());
    if (date.getMonth() === 9 && date.getDate() === thanksgiving.getDate()) {
        return {
            isHoliday: true,
            holidayName: 'Thanksgiving',
            recommendedTheme: 'AUTUMN',
            isBlackout: false,
        };
    }

    // 1. Check fixed holidays
    const fixedHoliday = FIXED_HOLIDAYS[dateKey];
    if (fixedHoliday) {
        return {
            isHoliday: true,
            holidayName: fixedHoliday.name,
            recommendedTheme: fixedHoliday.theme,
            isBlackout: fixedHoliday.isBlackout ?? false,
        };
    }

    // 1.5 Check movable holidays
    const year = date.getFullYear();
    if (MOVABLE_HOLIDAYS[year]) {
        const movableHoliday = MOVABLE_HOLIDAYS[year][dateKey];
        if (movableHoliday) {
            return {
                isHoliday: true,
                holidayName: movableHoliday.name,
                recommendedTheme: movableHoliday.theme,
                isBlackout: movableHoliday.isBlackout ?? false,
            };
        }
    }

    // 2. Check range-based holidays
    for (const range of HOLIDAY_RANGES) {
        if (isInRange(date, range)) {
            return {
                isHoliday: true,
                holidayName: range.name,
                recommendedTheme: range.theme,
                isBlackout: false,
            };
        }
    }

    // 3. No holiday
    return {
        isHoliday: false,
        holidayName: null,
        recommendedTheme: null,
        isBlackout: false,
    };
}
