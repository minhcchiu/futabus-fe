import { stopLocationApi } from "~/apis/futabus/stop_location.api";
import type { PaginateResponse } from "~/types/paginate-response.type";
import type { PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateStopLocation,
  StopLocation,
  UpdateStopLocation,
} from "~/validations/admin/stop_location.validation";

export const useStopLocationStore = defineStore("stop_location", () => {
  const loading = ref(false);
  const list = ref<StopLocation[]>([]);
  const paginate = ref<PaginateResponse<StopLocation> | null>(null);
  const selected = ref<StopLocation | null>(null);

  const fetchAll = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      list.value = await stopLocationApi.getAll(query);
      return list.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchPaginate = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      paginate.value = await stopLocationApi.paginate(query);
      return paginate.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string) => {
    selected.value = await stopLocationApi.getById(id);
    return selected.value;
  };

  const create = async (input: CreateStopLocation) => {
    loading.value = true;
    try {
      return await stopLocationApi.create(input);
    } finally {
      loading.value = false;
    }
  };

  const updateById = async (id: string, input: UpdateStopLocation) => {
    loading.value = true;
    try {
      return await stopLocationApi.updateById(id, input);
    } finally {
      loading.value = false;
    }
  };

  const deleteManyByIds = async (id: string[]) => {
    loading.value = true;
    try {
      return await stopLocationApi.deleteManyByIds(id);
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
    create,
    updateById,
    deleteManyByIds,
  };
});
