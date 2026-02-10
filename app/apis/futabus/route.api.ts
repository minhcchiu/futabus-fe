import type { PaginateResponse } from "~/types/paginate-response.type";
import type { UpdateResult } from "~/types/update-result";
import { authFetch, guestFetch } from "~/utils/fetch";
import type { FetchOptions, PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateRoute,
  Route,
  UpdateRoute,
} from "~/validations/admin/route.validation";

const ROUTE_URL = "/routes";
export const routeApi = {
  //  ----- Method: GET -----
  paginate: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<PaginateResponse<Route>> => {
    return guestFetch.get(`${ROUTE_URL}/paginate`, query, options);
  },

  getById: (
    id: string,
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<Route> => {
    return authFetch.get(`${ROUTE_URL}/${id}`, query, options);
  },

  getAll: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<Route[]> => {
    return guestFetch.get(ROUTE_URL, query, options);
  },

  //  ----- Method: POST -----
  create: (body: CreateRoute, options?: FetchOptions): Promise<Route> => {
    return authFetch.post(ROUTE_URL, body, options);
  },

  //  ----- Method: PATCH -----
  updateById: (
    id: string,
    body: UpdateRoute,
    options?: FetchOptions,
  ): Promise<Route> => {
    return authFetch.patch(`${ROUTE_URL}/${id}`, body, options);
  },

  //  ----- Method: DELETE -----
  deleteManyByIds: (ids: string[]): Promise<UpdateResult> => {
    return authFetch.delete(`${ROUTE_URL}/${ids.join(",")}/bulk`);
  },

  deleteById: (id: string): Promise<Route> => {
    return authFetch.delete(`${ROUTE_URL}/${id}`);
  },
};
