import type { PaginateResponse } from "~/types/paginate-response.type";
import type { UpdateResult } from "~/types/update-result";
import { authFetch, guestFetch } from "~/utils/fetch";
import type { FetchOptions, PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateSeat,
  Seat,
  UpdateSeat,
} from "~/validations/admin/seat.validation";

const SEAT_URL = "/seats";
export const seatApi = {
  //  ----- Method: GET -----
  paginate: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<PaginateResponse<Seat>> => {
    return guestFetch.get(`${SEAT_URL}/paginate`, query, options);
  },

  getById: (
    id: string,
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<Seat> => {
    return authFetch.get(`${SEAT_URL}/${id}`, query, options);
  },

  getAll: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<Seat[]> => {
    return guestFetch.get(SEAT_URL, query, options);
  },

  //  ----- Method: POST -----
  createMany: (body: CreateSeat[], options?: FetchOptions): Promise<Seat[]> => {
    return authFetch.post(`${SEAT_URL}/bulk`, body, options);
  },

  //  ----- Method: PATCH -----
  updateMany: (body: UpdateSeat[], options?: FetchOptions): Promise<Seat[]> => {
    return authFetch.patch(`${SEAT_URL}/bulk`, body, options);
  },

  updateById: (
    id: string,
    body: UpdateSeat,
    options?: FetchOptions,
  ): Promise<Seat> => {
    return authFetch.patch(`${SEAT_URL}/${id}`, body, options);
  },

  //  ----- Method: DELETE -----
  deleteManyByIds: (ids: string[]): Promise<UpdateResult> => {
    return authFetch.delete(`${SEAT_URL}/${ids.join(",")}/bulk`);
  },

  deleteById: (id: string): Promise<Seat> => {
    return authFetch.delete(`${SEAT_URL}/${id}`);
  },
};
