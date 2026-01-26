import type { PaginateResponse } from "~/types/paginate-response.type";
import type { UpdateResult } from "~/types/update-result";
import { authFetch, guestFetch } from "~/utils/fetch";
import type { FetchOptions, PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateTripPrice,
  TripPrice,
  UpdateTripPrice,
} from "~/validations/admin/trip_price.validation";

const TRIP_PRICE_URL = "/trip_prices";
export const tripPriceApi = {
  //  ----- Method: GET -----
  paginate: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<PaginateResponse<TripPrice>> => {
    return guestFetch.get(`${TRIP_PRICE_URL}/paginate`, query, options);
  },

  getById: (
    id: string,
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<TripPrice> => {
    return authFetch.get(`${TRIP_PRICE_URL}/${id}`, query, options);
  },

  getAll: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<TripPrice[]> => {
    return guestFetch.get(TRIP_PRICE_URL, query, options);
  },

  //  ----- Method: POST -----
  createMany: (
    body: CreateTripPrice[],
    options?: FetchOptions,
  ): Promise<TripPrice> => {
    return authFetch.post(`${TRIP_PRICE_URL}/bulk`, body, options);
  },

  //  ----- Method: PATCH -----
  updateMany: (
    body: UpdateTripPrice[],
    options?: FetchOptions,
  ): Promise<TripPrice> => {
    return authFetch.patch(`${TRIP_PRICE_URL}/bulk`, body, options);
  },

  //  ----- Method: DELETE -----
  deleteManyByIds: (ids: string[]): Promise<UpdateResult> => {
    return authFetch.delete(`${TRIP_PRICE_URL}/${ids.join(",")}/bulk`);
  },

  deleteById: (id: string): Promise<TripPrice> => {
    return authFetch.delete(`${TRIP_PRICE_URL}/${id}`);
  },
};
