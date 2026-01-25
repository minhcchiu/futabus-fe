import { z } from "zod";

export const CreateProvinceSchema = z.object({
  provinceId: z.string(),
  districtId: z.string(),
  wardName: z.string(),
});

export type CreateProvince = z.infer<typeof CreateProvinceSchema>;
export type UpdateProvince = z.infer<typeof CreateProvinceSchema>;
export type Province = {
  _id: string;
  name: string;
  nameEn: string;
  fullName: string;
  fullNameEn: string;
  codeName: string;
  sortOrder: number;
  administrativeUnit?: string;
  administrativeUnitEn?: string;
  administrativeRegion?: string;
  administrativeRegionEn?: string;
};
