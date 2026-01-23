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
    '12-24': { name: 'Christmas Eve', theme: 'COZY_SOMBER' },
    '12-25': { name: 'Christmas Day', theme: 'COZY_SOMBER' },
    '12-26': { name: 'Boxing Day', theme: 'COZY_SOMBER' },
    '12-31': { name: "New Year's Eve", theme: 'MANIC_PARTY' },
    '01-01': { name: "New Year's Day", theme: 'HYGGE_MODE' },
    '02-14': { name: "Valentine's Day", theme: null }, // Let weather decide, but mark as holiday
    '10-31': { name: "Halloween", theme: 'HALLOWEEN' },
    '07-01': { name: 'Canada Day', theme: 'PRAIRIE_GOLD' },

    // Winnipeg-specific events (approximate)
    '02-15': { name: 'Louis Riel Day', theme: 'HYGGE_MODE' }, // MB Holiday (3rd Monday Feb, ~Feb 15)
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

export function getHolidayContext(date: Date = new Date()): HolidayContext {
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

    // 1. Check fixed holidays first
    const fixedHoliday = FIXED_HOLIDAYS[dateKey];
    if (fixedHoliday) {
        return {
            isHoliday: true,
            holidayName: fixedHoliday.name,
            recommendedTheme: fixedHoliday.theme,
            isBlackout: fixedHoliday.isBlackout ?? false,
        };
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
