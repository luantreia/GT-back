export function toUTC(dateString: string, timeZone: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date input: ${dateString}`);
  }
  return date;
}
