import { z } from "zod";
import type { BusCompany } from "./bus_company.validation";

export enum VehicleStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum VehicleLevelEnum {
  SEAT = "SEAT",
  SLEEPER = "SLEEPER",
  LIMOUSINE = "LIMOUSINE",
}

export const CreateVehicleSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  plateNumber: z.string().min(5, "Plate number is required"),
  level: z.enum(["SLEEPER", "SEAT", "LIMOUSINE"]).default("SLEEPER"),
  totalSeat: z.number().min(1, "Total seat must be greater than 0"),
  hasUpperDeck: z.boolean().default(false),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  amenities: z.array(z.string()).default([]),
});

export type CreateVehicle = z.infer<typeof CreateVehicleSchema>;
export type UpdateVehicle = z.infer<typeof CreateVehicleSchema>;
export type Vehicle = {
  _id: string;
  companyId: BusCompany;
  plateNumber: string;
  level: VehicleLevelEnum;
  totalSeat: number;
  hasUpperDeck: boolean;
  status: VehicleStatusEnum;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
};
