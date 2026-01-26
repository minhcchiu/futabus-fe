import { tripPriceApi } from "~/apis/futabus/trip_price.api";
import type { PaginateResponse } from "~/types/paginate-response.type";
import type { PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateTripPrice,
  TripPrice,
  UpdateTripPrice,
} from "~/validations/admin/trip_price.validation";

export const useTripPriceStore = defineStore("trip_price", () => {
  const loading = ref(false);
  const list = ref<TripPrice[]>([]);
  const paginate = ref<PaginateResponse<TripPrice> | null>(null);
  const selected = ref<TripPrice | null>(null);

  const fetchAll = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      list.value = await tripPriceApi.getAll(query);
      return list.value;
    } finally {
      loading.value = false;
    }
  };
  const fetchPaginate = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      paginate.value = await tripPriceApi.paginate(query);
      return paginate.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string) => {
    selected.value = await tripPriceApi.getById(id);
    return selected.value;
  };

  const createMany = async (input: CreateTripPrice[]) => {
    loading.value = true;
    try {
      return await tripPriceApi.createMany(input);
    } finally {
      loading.value = false;
    }
  };

  const updateMany = async (input: UpdateTripPrice[]) => {
    loading.value = true;
    try {
      return await tripPriceApi.updateMany(input);
    } finally {
      loading.value = false;
    }
  };

  const deleteManyByIds = async (ids: string[]) => {
    loading.value = true;
    try {
      return await tripPriceApi.deleteManyByIds(ids);
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
    createMany,
    updateMany,
    deleteManyByIds,
  };
});
