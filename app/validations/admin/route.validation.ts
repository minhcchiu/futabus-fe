import { z } from "zod";
import type { BusCompany } from "~/validations/admin/bus_company.validation";
import type { StopLocation } from "~/validations/admin/stop_location.validation";
import type { Province } from "~/validations/pre-built/province.validation";

export const CreateRouteSchema = z.object({
  companyId: z.string(),
  startStopId: z.string(),
  endStopId: z.string(),
});

export type CreateRoute = z.infer<typeof CreateRouteSchema>;
export type UpdateRoute = z.infer<typeof CreateRouteSchema>;
export type Route = {
  _id: string;
  companyId: BusCompany;
  startStopId: StopLocation;
  endStopId: StopLocation;
  createdAt: string;
  updatedAt: string;
};

export type LocationsFromTo = {
  provinceFrom: Province;
  provincesTo: Province[];
};
