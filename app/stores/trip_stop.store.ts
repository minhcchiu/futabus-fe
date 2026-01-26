import { tripStopApi } from "~/apis/futabus/trip_stop.api";
import type { PaginateResponse } from "~/types/paginate-response.type";
import type { PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateTripStop,
  TripStop,
  UpdateTripStop,
} from "~/validations/admin/trip_stop.validation";

export const useTripStopStore = defineStore("trip_stop", () => {
  const loading = ref(false);
  const list = ref<TripStop[]>([]);
  const paginate = ref<PaginateResponse<TripStop> | null>(null);
  const selected = ref<TripStop | null>(null);

  const fetchAll = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      list.value = await tripStopApi.getAll(query);
      return list.value;
    } finally {
      loading.value = false;
    }
  };
  const fetchPaginate = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      paginate.value = await tripStopApi.paginate(query);
      return paginate.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string) => {
    selected.value = await tripStopApi.getById(id);
    return selected.value;
  };

  const create = async (input: CreateTripStop) => {
    loading.value = true;
    try {
      return await tripStopApi.create(input);
    } finally {
      loading.value = false;
    }
  };

  const updateById = async (id: string, input: UpdateTripStop) => {
    loading.value = true;
    try {
      return await tripStopApi.updateById(id, input);
    } finally {
      loading.value = false;
    }
  };

  const deleteManyByIds = async (ids: string[]) => {
    loading.value = true;
    try {
      return await tripStopApi.deleteManyByIds(ids);
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
