import { districtApi } from "~/apis/pre-built/14-district.api";
import type { PaginateResponse } from "~/types/paginate-response.type";
import type { PaginationParams } from "~/utils/types/fetch.types";
import type { District } from "~/validations/pre-built/district.validation";

export const useDistrictStore = defineStore("district", () => {
  const loading = ref(false);
  const list = ref<District[]>([]);
  const paginate = ref<PaginateResponse<District> | null>(null);
  const selected = ref<District | null>(null);

  const fetchAll = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      list.value = await districtApi.getAll(query);
      return list.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchPaginate = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      paginate.value = await districtApi.paginate(query);
      return paginate.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string) => {
    selected.value = await districtApi.getById(id);
    return selected.value;
  };

  return {
    loading,
    list,
    paginate,
    selected,
    fetchAll,
    fetchPaginate,
    fetchById,
  };
});
