import { parse, parseISO, isValid } from 'date-fns'
import { ref } from 'vue';

// your custom fallback formats
const POSSIBLE_FORMATS = [
  "yyyy-MM-dd",
  "d MMMM yyyy",
  "MMMM d, yyyy",
  "MM/dd/yyyy",
];

export const useDateFormat = () => {
  const formatDate = (date: Date) => {
    const opts: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', opts).format(date);
  };

  const formatDateString = (input?: string | Date | null) => {
    // 1) handle null / undefined
    if (!input) return '';

    // 2) if it's already a Date, use it directly
    let dt: Date | null = input instanceof Date
      ? input
      : null;

    // 3) ensure we have a trimmed string
    const s = (typeof input === 'string' ? input.trim() : '');

    // 4) native Date parse (covers basic ISO + RFC)
    if (!dt) {
      const n = new Date(s);
      if (!Number.isNaN(n.getTime())) dt = n;
    }

    // 5) extended ISO with parseISO (microseconds etc)
    if (!dt) {
      try {
        const iso = parseISO(s);
        if (isValid(iso)) dt = iso;
      } catch {
        // fall through
      }
    }

    // 6) custom formats
    if (!dt) {
      for (const fmt of POSSIBLE_FORMATS) {
        const p = parse(s, fmt, new Date());
        if (isValid(p)) {
          dt = p;
          break;
        }
      }
    }

    // 7) if still no parse, give up
    if (!dt) {
      console.warn(`Could not parse date: "${input}"`);
      return s;
    }

    return formatDate(dt);
  };

  return {
    formatDate,
    formatDateString,
  };
};
