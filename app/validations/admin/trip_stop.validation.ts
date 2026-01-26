import { z } from "zod";
import type { Route } from "~/validations/admin/route.validation";
import type { Trip } from "~/validations/trip.validation";

export const CreateTripStopSchema = z.object({
  tripId: z.string(),
  routeId: z.string(),
  arrivalTime: z.number(),
  departureTime: z.number(),
});

export type CreateTripStop = z.infer<typeof CreateTripStopSchema>;
export type UpdateTripStop = z.infer<typeof CreateTripStopSchema>;
export type TripStop = {
  _id: string;
  tripId: Trip;
  routeId: Route;
  arrivalTime?: number;
  departureTime?: number;
};
