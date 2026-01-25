import { wardApi } from "~/apis/pre-built/15-ward.api";
import type { PaginateResponse } from "~/types/paginate-response.type";
import type { PaginationParams } from "~/utils/types/fetch.types";
import type { Ward } from "~/validations/pre-built/ward.validation";

export const useWardStore = defineStore("ward", () => {
  const loading = ref(false);
  const list = ref<Ward[]>([]);
  const paginate = ref<PaginateResponse<Ward> | null>(null);
  const selected = ref<Ward | null>(null);

  const fetchAll = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      list.value = await wardApi.getAll(query);
      return list.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchPaginate = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      paginate.value = await wardApi.paginate(query);
      return paginate.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string) => {
    selected.value = await wardApi.getById(id);
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
