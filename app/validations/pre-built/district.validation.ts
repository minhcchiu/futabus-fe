import type { Province } from "~/validations/pre-built/province.validation";

export type District = {
  _id: string;
  provinceId: Province;
  name: string;
  nameEn: string;
  fullName: string;
  fullNameEn: string;
  codeName: string;
  sortOrder: number;
  administrativeUnit?: string;
  administrativeUnitEn?: string;
};
