import type { PaginateResponse } from "~/types/paginate-response.type";
import type { UpdateResult } from "~/types/update-result";
import { authFetch, guestFetch } from "~/utils/fetch";
import type { FetchOptions, PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateSepay,
  GenerateQrCode,
  Sepay,
  UpdateSepay,
} from "~/validations/admin/sepay.validation";

const SEPAY_URL = "/sepay";
export const sepayApi = {
  //  ----- Method: GET -----
  paginate: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<PaginateResponse<Sepay>> => {
    return guestFetch.get(`${SEPAY_URL}/paginate`, query, options);
  },

  getOne: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<Sepay> => {
    return authFetch.get(`${SEPAY_URL}/one`, query, options);
  },

  getById: (
    id: string,
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<Sepay> => {
    return authFetch.get(`${SEPAY_URL}/${id}`, query, options);
  },

  getAll: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<Sepay[]> => {
    return guestFetch.get(SEPAY_URL, query, options);
  },

  //  ----- Method: POST -----
  generateQRCode: (
    body: GenerateQrCode,
    options?: FetchOptions,
  ): Promise<{ url: string }> => {
    return authFetch.post(`${SEPAY_URL}/qrcode`, body, options);
  },

  create: (body: CreateSepay, options?: FetchOptions): Promise<Sepay> => {
    return authFetch.post(SEPAY_URL, body, options);
  },

  //  ----- Method: PATCH -----
  updateById: (
    id: string,
    body: UpdateSepay,
    options?: FetchOptions,
  ): Promise<Sepay> => {
    return authFetch.patch(`${SEPAY_URL}/${id}`, body, options);
  },

  //  ----- Method: DELETE -----
  deleteManyByIds: (ids: string[]): Promise<UpdateResult> => {
    return authFetch.delete(`${SEPAY_URL}/${ids.join(",")}/bulk`);
  },
};
