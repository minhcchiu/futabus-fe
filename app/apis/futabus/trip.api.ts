import type { PaginateResponse } from "~/types/paginate-response.type";
import type { UpdateResult } from "~/types/update-result";
import { authFetch, guestFetch } from "~/utils/fetch";
import type { FetchOptions, PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateTrip,
  Trip,
  UpdateTrip,
} from "~/validations/admin/trip.validation";

const TRIP_URL = "/trips";
export const tripApi = {
  //  ----- Method: GET -----
  paginate: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<PaginateResponse<Trip>> => {
    return guestFetch.get(`${TRIP_URL}/paginate`, query, options);
  },

  getById: (
    id: string,
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<Trip> => {
    return authFetch.get(`${TRIP_URL}/${id}`, query, options);
  },

  getAll: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<Trip[]> => {
    return guestFetch.get(TRIP_URL, query, options);
  },

  //  ----- Method: POST -----
  create: (body: CreateTrip, options?: FetchOptions): Promise<Trip> => {
    return authFetch.post(TRIP_URL, body, options);
  },

  //  ----- Method: PATCH -----
  updateById: (
    id: string,
    body: UpdateTrip,
    options?: FetchOptions,
  ): Promise<Trip> => {
    return authFetch.patch(`${TRIP_URL}/${id}`, body, options);
  },

  //  ----- Method: DELETE -----
  deleteManyByIds: (ids: string[]): Promise<UpdateResult> => {
    return authFetch.delete(`${TRIP_URL}/${ids.join(",")}/bulk`);
  },

  deleteById: (id: string): Promise<Trip> => {
    return authFetch.delete(`${TRIP_URL}/${id}`);
  },
};
