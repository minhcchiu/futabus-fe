import type { PaginateResponse } from "~/types/paginate-response.type";
import type { UpdateResult } from "~/types/update-result";
import { authFetch, guestFetch } from "~/utils/fetch";
import type { FetchOptions, PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateTripStop,
  TripStop,
  UpdateTripStop,
} from "~/validations/admin/trip_stop.validation";

const TRIP_STOP_URL = "/trip_stops";
export const tripStopApi = {
  //  ----- Method: GET -----
  paginate: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<PaginateResponse<TripStop>> => {
    return guestFetch.get(`${TRIP_STOP_URL}/paginate`, query, options);
  },

  getById: (
    id: string,
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<TripStop> => {
    return authFetch.get(`${TRIP_STOP_URL}/${id}`, query, options);
  },

  getAll: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<TripStop[]> => {
    return guestFetch.get(TRIP_STOP_URL, query, options);
  },

  //  ----- Method: POST -----
  create: (body: CreateTripStop, options?: FetchOptions): Promise<TripStop> => {
    return authFetch.post(TRIP_STOP_URL, body, options);
  },

  //  ----- Method: PATCH -----
  updateById: (
    id: string,
    body: UpdateTripStop,
    options?: FetchOptions,
  ): Promise<TripStop> => {
    return authFetch.patch(`${TRIP_STOP_URL}/${id}`, body, options);
  },

  //  ----- Method: DELETE -----
  deleteManyByIds: (ids: string[]): Promise<UpdateResult> => {
    return authFetch.delete(`${TRIP_STOP_URL}/${ids.join(",")}/bulk`);
  },

  deleteById: (id: string): Promise<TripStop> => {
    return authFetch.delete(`${TRIP_STOP_URL}/${id}`);
  },
};
