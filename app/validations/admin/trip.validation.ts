import { z } from "zod";
import type { BusCompany } from "~/validations/admin/bus_company.validation";
import type { Route } from "~/validations/admin/route.validation";
import type { TripPrice } from "~/validations/admin/trip_price.validation";
import type { TripStop } from "~/validations/admin/trip_stop.validation";
import type { Vehicle } from "~/validations/admin/vehicle.validation";

export enum TripStatus {
  CREATED = "CREATED", // Đã tạo chuyến, chưa khởi hành
  DEPARTED = "DEPARTED", // Đã khởi hành
  IN_PROGRESS = "IN_PROGRESS", // Đang chạy
  COMPLETED = "COMPLETED", // Hoàn thành chuyến
  CANCELLED = "CANCELLED", // Hủy chuyến
}

export const CreateTripSchema = z.object({
  routeId: z.string().optional(),
  companyId: z.string(),
  vehicleId: z.string(),
  departureTime: z.number(),
  arrivalTime: z.number(),
  price: z.number().optional(),
  departureProvinceIds: z.array(z.string()).optional(),
  arrivalProvinceIds: z.array(z.string()).optional(),
  status: z.enum([
    TripStatus.CREATED,
    TripStatus.DEPARTED,
    TripStatus.IN_PROGRESS,
    TripStatus.COMPLETED,
    TripStatus.CANCELLED,
  ]),
});

export type CreateTrip = z.infer<typeof CreateTripSchema>;

export type UpdateTrip = z.infer<typeof CreateTripSchema>;
export type Trip = {
  _id: string;
  routeId: Route;
  companyId: BusCompany;
  vehicleId: Vehicle;
  departureTime: number;
  arrivalTime?: number;
  price?: number;
  emptySeat?: number;
  departureProvinceIds?: string[];
  arrivalProvinceIds?: string[];
  status: TripStatus;
  tripPrices: TripPrice[];
  tripStops: TripStop[];
};
