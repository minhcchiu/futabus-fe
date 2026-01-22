import { z } from "zod";

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
  provinceId: string;
  districtId?: string;
  wardId?: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
};
