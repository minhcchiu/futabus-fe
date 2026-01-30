import { settingApi } from "~/apis/futabus/setting.api";
import type { PaginateResponse } from "~/types/paginate-response.type";
import type { PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateSetting,
  Setting,
  UpdateSetting,
} from "~/validations/admin/setting.validation";

export const useSettingStore = defineStore("setting", () => {
  const loading = ref(false);
  const list = ref<Setting[]>([]);
  const paginate = ref<PaginateResponse<Setting> | null>(null);
  const selected = ref<Setting | null>(null);

  const fetchAll = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      list.value = await settingApi.getAll(query);
      return list.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchPaginate = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      paginate.value = await settingApi.paginate(query);
      return paginate.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string) => {
    selected.value = await settingApi.getById(id);
    return selected.value;
  };

  const fetchOne = async () => {
    selected.value = await settingApi.getOne();
    return selected.value;
  };

  const create = async (input: CreateSetting) => {
    loading.value = true;
    try {
      return await settingApi.create(input);
    } finally {
      loading.value = false;
    }
  };

  const updateById = async (id: string, input: UpdateSetting) => {
    loading.value = true;
    try {
      return await settingApi.updateById(id, input);
    } finally {
      loading.value = false;
    }
  };

  const deleteManyByIds = async (ids: string[]) => {
    loading.value = true;
    try {
      return await settingApi.deleteManyByIds(ids);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    list,
    paginate,
    selected,
    fetchAll,
    fetchPaginate,
    fetchById,
    fetchOne,
    create,
    updateById,
    deleteManyByIds,
  };
});
