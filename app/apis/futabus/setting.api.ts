import type { PaginateResponse } from "~/types/paginate-response.type";
import type { UpdateResult } from "~/types/update-result";
import { authFetch, guestFetch } from "~/utils/fetch";
import type { FetchOptions, PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateSetting,
  Setting,
  UpdateSetting,
} from "~/validations/admin/setting.validation";

const SETTING_URL = "/settings";
export const settingApi = {
  //  ----- Method: GET -----
  paginate: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<PaginateResponse<Setting>> => {
    return guestFetch.get(`${SETTING_URL}/paginate`, query, options);
  },

  getOne: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<Setting> => {
    return authFetch.get(`${SETTING_URL}/one`, query, options);
  },

  getById: (
    id: string,
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<Setting> => {
    return authFetch.get(`${SETTING_URL}/${id}`, query, options);
  },

  getAll: (
    query?: PaginationParams,
    options?: FetchOptions,
  ): Promise<Setting[]> => {
    return guestFetch.get(SETTING_URL, query, options);
  },

  //  ----- Method: POST -----
  create: (body: CreateSetting, options?: FetchOptions): Promise<Setting> => {
    return authFetch.post(SETTING_URL, body, options);
  },

  //  ----- Method: PATCH -----
  updateStatus: (
    id: string,
    body: UpdateSetting,
    options?: FetchOptions,
  ): Promise<Setting> => {
    return authFetch.patch(`${SETTING_URL}/${id}/status`, body, options);
  },

  updateById: (
    id: string,
    body: UpdateSetting,
    options?: FetchOptions,
  ): Promise<Setting> => {
    return authFetch.patch(`${SETTING_URL}/${id}`, body, options);
  },

  //  ----- Method: DELETE -----
  deleteManyByIds: (ids: string[]): Promise<UpdateResult> => {
    return authFetch.delete(`${SETTING_URL}/${ids.join(",")}/bulk`);
  },
};
