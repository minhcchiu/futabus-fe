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
export function formatDurationShort(minutes?: number): string {
  if (!minutes || minutes <= 0) return "—";

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h && m) return `${h}h${m}p`;
  if (h) return `${h}h`;
  return `${m}p`;
}
