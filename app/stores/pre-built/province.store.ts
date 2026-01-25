import { provinceApi } from "~/apis/pre-built/13-province.api";
import type { PaginateResponse } from "~/types/paginate-response.type";
import type { PaginationParams } from "~/utils/types/fetch.types";
import type { Province } from "~/validations/pre-built/province.validation";

export const useProvinceStore = defineStore("province", () => {
  const loading = ref(false);
  const list = ref<Province[]>([]);
  const paginate = ref<PaginateResponse<Province> | null>(null);
  const selected = ref<Province | null>(null);

  const fetchAll = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      list.value = await provinceApi.getAll(query);
      return list.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchPaginate = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      paginate.value = await provinceApi.paginate(query);
      return paginate.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string) => {
    selected.value = await provinceApi.getById(id);
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
