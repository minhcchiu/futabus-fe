import { tripApi } from "~/apis/futabus/trip.api";
import type { PaginateResponse } from "~/types/paginate-response.type";
import type { PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateTrip,
  Trip,
  UpdateTrip,
} from "~/validations/admin/trip.validation";

export const useTripStore = defineStore("trip", () => {
  const loading = ref(false);
  const list = ref<Trip[]>([]);
  const paginate = ref<PaginateResponse<Trip> | null>(null);
  const selected = ref<Trip | null>(null);

  const fetchAll = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      list.value = await tripApi.getAll(query);
      return list.value;
    } finally {
      loading.value = false;
    }
  };
  const fetchPaginate = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      paginate.value = await tripApi.paginate(query);
      return paginate.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string, query?: PaginationParams) => {
    selected.value = await tripApi.getById(id, query);
    return selected.value;
  };

  const create = async (input: CreateTrip) => {
    loading.value = true;
    try {
      return await tripApi.create(input);
    } finally {
      loading.value = false;
    }
  };

  const updateById = async (id: string, input: UpdateTrip) => {
    loading.value = true;
    try {
      return await tripApi.updateById(id, input);
    } finally {
      loading.value = false;
    }
  };

  const deleteManyByIds = async (ids: string[]) => {
    loading.value = true;
    try {
      return await tripApi.deleteManyByIds(ids);
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
