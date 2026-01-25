import type { PaginateResponse } from "~/types/paginate-response.type";
import type { UpdateResult } from "~/types/update-result";
import { authFetch, guestFetch } from "~/utils/fetch";
import type { FetchOptions, PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateStopLocation,
  StopLocation,
  UpdateStopLocation,
} from "~/validations/admin/stop_location.validation";

const STOP_LOCATION_URL = "/stop_locations";
export const stopLocationApi = {
  //  ----- Method: GET -----
  paginate: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<PaginateResponse<StopLocation>> => {
    return guestFetch.get(`${STOP_LOCATION_URL}/paginate`, query, options);
  },

  getById: (
    id: string,
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<StopLocation> => {
    return authFetch.get(`${STOP_LOCATION_URL}/${id}`, query, options);
  },

  getAll: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<StopLocation[]> => {
    return guestFetch.get(STOP_LOCATION_URL, query, options);
  },

  //  ----- Method: POST -----
  create: (
    body: CreateStopLocation,
    options?: FetchOptions,
  ): Promise<StopLocation> => {
    return authFetch.post(STOP_LOCATION_URL, body, options);
  },

  //  ----- Method: PATCH -----
  updateById: (
    id: string,
    body: UpdateStopLocation,
    options?: FetchOptions,
  ): Promise<StopLocation> => {
    return authFetch.patch(`${STOP_LOCATION_URL}/${id}`, body, options);
  },

  //  ----- Method: DELETE -----
  deleteManyByIds: (ids: string[]): Promise<UpdateResult> => {
    return authFetch.delete(`${STOP_LOCATION_URL}/${ids.join(",")}/bulk`);
  },

  deleteById: (id: string): Promise<StopLocation> => {
    return authFetch.delete(`${STOP_LOCATION_URL}/${id}`);
  },
};
