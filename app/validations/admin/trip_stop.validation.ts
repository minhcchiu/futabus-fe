import { z } from "zod";
import type { StopLocation } from "~/validations/admin/stop_location.validation";
import type { Trip } from "~/validations/admin/trip.validation";

export const CreateTripStopSchema = z.object({
  tripId: z.string(),
  stopId: z.string(),
  arrivalTime: z.number().nullable(),
  departureTime: z.number().nullable(),
});

export type CreateTripStop = z.infer<typeof CreateTripStopSchema>;
export type UpdateTripStop = z.infer<typeof CreateTripStopSchema>;
export type TripStop = {
  _id: string;
  tripId: Trip;
  stopId: StopLocation;
  arrivalTime?: number;
  departureTime?: number;
};
