export function getNextRakhiDate(): Date {
  const rakhiDates = [
    new Date('2024-08-19T00:00:00+05:30'),
    new Date('2025-08-09T00:00:00+05:30'),
    new Date('2026-08-28T00:00:00+05:30'),
    new Date('2027-08-17T00:00:00+05:30'),
    new Date('2028-08-05T00:00:00+05:30'),
    new Date('2029-08-24T00:00:00+05:30'),
    new Date('2030-08-13T00:00:00+05:30'),
  ];

  const now = new Date();
  
  // Find the first date in the future
  for (const date of rakhiDates) {
    if (date.getTime() > now.getTime() - (24 * 60 * 60 * 1000)) {
      // Keep it active for the day of Rakhi as well by subtracting a day in the condition
      return date;
    }
  }

  // Fallback to the last known date if we run out (or throw an error/log)
  return rakhiDates[rakhiDates.length - 1];
}

export function getDaysUntilRakhi(): { days: number, date: Date } {
  const target = getNextRakhiDate();
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  return { days, date: target };
}
