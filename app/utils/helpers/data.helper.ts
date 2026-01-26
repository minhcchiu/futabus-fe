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
