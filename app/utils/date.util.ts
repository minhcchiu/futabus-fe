import { format } from "date-fns";

export const formatDateToUrl = (date: number | Date) => {
  return format(date, "yyyy-MM-dd");
};

export const formatDateUrlToNumber = (date?: string) => {
  if (!date) return Date.now();

  const [year, month, day] = date.split("-");

  return new Date(+year!, +month! - 1, +day!).getTime();
};
