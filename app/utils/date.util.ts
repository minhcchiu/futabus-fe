import { format } from "date-fns";

export const formatDateToUrl = (date: number | Date) => {
  return format(date, "yyyy-MM-dd");
};

export const formatDateUrlToNumber = (date?: string) => {
  if (!date) return Date.now();

  const [year, month, day] = date.split("-");

  return new Date(+year!, +month! - 1, +day!).getTime();
};

// 1h30p, 2h, 45p
export function formatDurationShort(hours?: number): string {
  if (!hours || hours <= 0) return "—";

  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if (h && m) return `${h}h${m}p`;
  if (h) return `${h}h`;
  return `${m}p`;
}
