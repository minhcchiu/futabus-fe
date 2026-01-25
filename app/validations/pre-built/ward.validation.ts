import type { District } from "~/validations/pre-built/district.validation";
import type { Province } from "~/validations/pre-built/province.validation";

export type Ward = {
  _id: string;
  provinceId: Province;
  districtId: District;
  name: string;
  nameEn: string;
  fullName: string;
  fullNameEn: string;
  codeName: string;
  sortOrder: number;
  administrativeUnit?: string;
  administrativeUnitEn?: string;
};
