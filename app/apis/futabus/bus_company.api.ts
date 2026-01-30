import type { PaginateResponse } from "~/types/paginate-response.type";
import type { UpdateResult } from "~/types/update-result";
import { authFetch, guestFetch } from "~/utils/fetch";
import type { FetchOptions, PaginationParams } from "~/utils/types/fetch.types";
import type {
  BusCompany,
  CreateBusCompany,
  UpdateBusCompany,
} from "~/validations/admin/bus_company.validation";

const BUS_COMPANY_URL = "/bus_companies";
export const busCompanyApi = {
  //  ----- Method: GET -----
  paginate: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<PaginateResponse<BusCompany>> => {
    return guestFetch.get(`${BUS_COMPANY_URL}/paginate`, query, options);
  },

  getById: (
    id: string,
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<BusCompany> => {
    return authFetch.get(`${BUS_COMPANY_URL}/${id}`, query, options);
  },

  getAll: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<BusCompany[]> => {
    return guestFetch.get(BUS_COMPANY_URL, query, options);
  },

  //  ----- Method: POST -----
  create: (
    body: CreateBusCompany,
    options?: FetchOptions,
  ): Promise<BusCompany> => {
    return authFetch.post(BUS_COMPANY_URL, body, options);
  },

  //  ----- Method: PATCH -----
  updateById: (
    id: string,
    body: UpdateBusCompany,
    options?: FetchOptions,
  ): Promise<BusCompany> => {
    return authFetch.patch(`${BUS_COMPANY_URL}/${id}`, body, options);
  },

  //  ----- Method: DELETE -----
  deleteManyByIds: (ids: string[]): Promise<UpdateResult> => {
    return authFetch.delete(`${BUS_COMPANY_URL}/${ids.join(",")}/bulk`);
  },
};
