import { z } from "zod";
import type { District } from "~/validations/pre-built/district.validation";
import type { Province } from "~/validations/pre-built/province.validation";
import type { Ward } from "~/validations/pre-built/ward.validation";

export const CreateStopLocationSchema = z.object({
  name: z.string(),
  address: z.string(),
  provinceId: z.string(),
  districtId: z.string().optional(),
  wardId: z.string().optional(),
});

export type CreateStopLocation = z.infer<typeof CreateStopLocationSchema>;
export type UpdateStopLocation = z.infer<typeof CreateStopLocationSchema>;
export type StopLocation = {
  _id: string;
  name: string;
  address: string;
  provinceId: Province;
  districtId?: District;
  wardId?: Ward;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
};
