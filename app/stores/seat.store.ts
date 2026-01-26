import { seatApi } from "~/apis/futabus/seat.api";
import type { PaginateResponse } from "~/types/paginate-response.type";
import type { PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateSeat,
  Seat,
  UpdateSeat,
} from "~/validations/admin/seat.validation";

export const useSeatStore = defineStore("seat", () => {
  const loading = ref(false);
  const list = ref<Seat[]>([]);
  const paginate = ref<PaginateResponse<Seat> | null>(null);
  const selected = ref<Seat | null>(null);

  const fetchAll = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      list.value = await seatApi.getAll(query);
      return list.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchPaginate = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      paginate.value = await seatApi.paginate(query);
      return paginate.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string) => {
    selected.value = await seatApi.getById(id);
    return selected.value;
  };

  const createMany = async (input: CreateSeat[]) => {
    loading.value = true;
    try {
      return await seatApi.createMany(input);
    } finally {
      loading.value = false;
    }
  };

  const updateMany = async (input: UpdateSeat[]) => {
    loading.value = true;
    try {
      return await seatApi.updateMany(input);
    } finally {
      loading.value = false;
    }
  };

  const updateById = async (id: string, input: UpdateSeat) => {
    loading.value = true;
    try {
      return await seatApi.updateById(id, input);
    } finally {
      loading.value = false;
    }
  };

  const deleteManyByIds = async (ids: string[]) => {
    loading.value = true;
    try {
      return await seatApi.deleteManyByIds(ids);
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
    updateById,
    deleteManyByIds,
  };
});
