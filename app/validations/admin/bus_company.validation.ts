import { z } from "zod";
export type BusCompanyStatus = "ACTIVE" | "INACTIVE";

export const CreateBusCompanySchema = z.object({
  userId: z.string().optional(),
  name: z.string({ required_error: "Name is required" }).trim(),
  hotline: z.string({ required_error: "Hotline is required" }).trim(),
  hotlineList: z.array(z.string()).default([]),
  description: z.string().default(""),
  policy: z.string().default(""),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type CreateBusCompany = z.infer<typeof CreateBusCompanySchema>;
export type UpdateBusCompany = z.infer<typeof CreateBusCompanySchema>;
export type BusCompany = CreateBusCompany & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};
