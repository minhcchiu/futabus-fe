export const hasNonEmptyValue = (obj: { [key: string]: any }) => {
  return Object.values(obj).some(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value?.length > 0,
  );
};

export const convertStringToRegex = (value?: string) => {
  if (!value) return undefined;

  return new RegExp(value, "i").toString();
};

export const toVnd = (num: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

export function toCamelCase(input: string) {
  return input
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^(.)/, (m) => m.toUpperCase());
}

export const formatTime = (timestamp?: number) => {
  if (!timestamp) return "-";
  const d = new Date(timestamp);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
};

export const formatDateTime = (timestamp?: number) => {
  if (!timestamp) return "--";
  const d = new Date(timestamp);
  return d.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatMoney = (v: number) => v.toLocaleString("vi-VN") + "đ";
