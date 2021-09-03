import { utcToZonedTime } from 'date-fns-tz';

export function getLocalDateFromUTC(date: string): Date {
  return utcToZonedTime(date, Intl.DateTimeFormat().resolvedOptions().timeZone);
}
