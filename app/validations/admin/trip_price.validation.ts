import { z } from "zod";
import type { Seat } from "~/validations/admin/seat.validation";
import type { StopLocation } from "~/validations/admin/stop_location.validation";
import type { Trip } from "~/validations/trip.validation";

export const CreateTripPriceSchema = z.object({
  tripId: z.string(),
  fromStopId: z.string().optional(),
  toStopId: z.string().optional(),
  price: z.number(),
  seatId: z.string(),
});

export type CreateTripPrice = z.infer<typeof CreateTripPriceSchema>;

export const UpdateTripPriceSchema = CreateTripPriceSchema.partial();
export type UpdateTripPrice = z.infer<typeof UpdateTripPriceSchema>;
export type TripPrice = {
  _id: string;
  tripId: Trip;
  fromStopId?: StopLocation;
  toStopId?: StopLocation;
  price: number;
  seatId: Seat;
};
