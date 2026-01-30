import { z } from "zod";

export const CreateSeatSchema = z.object({
  _id: z.string().optional(),
  vehicleId: z.string(),
  name: z.string().optional(),
  code: z.string(),
  floor: z.number(),
  row: z.number(),
  column: z.number(),
  isVip: z.boolean(),
  isActive: z.boolean(),
});

export type CreateSeat = z.infer<typeof CreateSeatSchema>;

export const UpdateSeatSchema = CreateSeatSchema.partial();
export type UpdateSeat = z.infer<typeof UpdateSeatSchema>;
export type Seat = {
  _id: string;
  vehicleId: string;
  name?: string;
  code: string;
  floor: number;
  row: number;
  column: number;
  isVip: boolean;
  isActive: boolean;
  editing?: boolean;
  isBooked?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
