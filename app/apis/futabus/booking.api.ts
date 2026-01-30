import type { PaginateResponse } from "~/types/paginate-response.type";
import type { UpdateResult } from "~/types/update-result";
import { authFetch, guestFetch } from "~/utils/fetch";
import type { FetchOptions, PaginationParams } from "~/utils/types/fetch.types";
import type {
  Booking,
  CreateBooking,
  UpdateBooking,
} from "~/validations/admin/booking.validation";

const BOOKING_URL = "/bookings";
export const bookingApi = {
  //  ----- Method: GET -----
  getSeatsBooked: (query?: PaginationParams): Promise<string[]> => {
    return guestFetch.get(`${BOOKING_URL}/seats/booked`, query);
  },

  paginate: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<PaginateResponse<Booking>> => {
    return guestFetch.get(`${BOOKING_URL}/paginate`, query, options);
  },

  getById: (
    id: string,
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<Booking> => {
    return authFetch.get(`${BOOKING_URL}/${id}`, query, options);
  },

  getAll: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<Booking[]> => {
    return guestFetch.get(BOOKING_URL, query, options);
  },

  //  ----- Method: POST -----
  create: (body: CreateBooking, options?: FetchOptions): Promise<Booking> => {
    return authFetch.post(BOOKING_URL, body, options);
  },

  //  ----- Method: PATCH -----
  updateStatus: (
    id: string,
    body: UpdateBooking,
    options?: FetchOptions,
  ): Promise<Booking> => {
    return authFetch.patch(`${BOOKING_URL}/${id}/status`, body, options);
  },

  updateById: (
    id: string,
    body: UpdateBooking,
    options?: FetchOptions,
  ): Promise<Booking> => {
    return authFetch.patch(`${BOOKING_URL}/${id}`, body, options);
  },

  //  ----- Method: DELETE -----
  deleteManyByIds: (ids: string[]): Promise<UpdateResult> => {
    return authFetch.delete(`${BOOKING_URL}/${ids.join(",")}/bulk`);
  },

  deleteById: (id: string): Promise<Booking> => {
    return authFetch.delete(`${BOOKING_URL}/${id}`);
  },
};
