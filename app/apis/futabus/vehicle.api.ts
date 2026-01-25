import type { PaginateResponse } from "~/types/paginate-response.type";
import type { UpdateResult } from "~/types/update-result";
import { authFetch, guestFetch } from "~/utils/fetch";
import type { FetchOptions, PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateVehicle,
  UpdateVehicle,
  Vehicle,
} from "~/validations/admin/vehicle.validation";

const VEHICLE_URL = "/vehicles";
export const vehicleApi = {
  //  ----- Method: GET -----
  paginate: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<PaginateResponse<Vehicle>> => {
    return guestFetch.get(`${VEHICLE_URL}/paginate`, query, options);
  },

  getById: (
    id: string,
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<Vehicle> => {
    return authFetch.get(`${VEHICLE_URL}/${id}`, query, options);
  },

  getAll: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<Vehicle[]> => {
    return guestFetch.get(VEHICLE_URL, query, options);
  },

  //  ----- Method: POST -----
  create: (body: CreateVehicle, options?: FetchOptions): Promise<Vehicle> => {
    return authFetch.post(VEHICLE_URL, body, options);
  },

  //  ----- Method: PATCH -----
  updateById: (
    id: string,
    body: UpdateVehicle,
    options?: FetchOptions,
  ): Promise<Vehicle> => {
    return authFetch.patch(`${VEHICLE_URL}/${id}`, body, options);
  },

  //  ----- Method: DELETE -----
  deleteManyByIds: (ids: string[]): Promise<UpdateResult> => {
    return authFetch.delete(`${VEHICLE_URL}/${ids.join(",")}/bulk`);
  },
};
