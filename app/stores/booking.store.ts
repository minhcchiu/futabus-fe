import { bookingApi } from "~/apis/futabus/booking.api";
import type { PaginateResponse } from "~/types/paginate-response.type";
import type { PaginationParams } from "~/utils/types/fetch.types";
import type {
  Booking,
  CreateBooking,
  UpdateBooking,
} from "~/validations/admin/booking.validation";

export const useBookingStore = defineStore("booking", () => {
  const loading = ref(false);
  const list = ref<Booking[]>([]);
  const paginate = ref<PaginateResponse<Booking> | null>(null);
  const selected = ref<Booking | null>(null);

  const fetchAll = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      list.value = await bookingApi.getAll(query);
      return list.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchPaginate = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      paginate.value = await bookingApi.paginate(query);
      return paginate.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string, query?: PaginationParams) => {
    selected.value = await bookingApi.getById(id, query);
    return selected.value;
  };

  const create = async (input: CreateBooking) => {
    loading.value = true;
    try {
      return await bookingApi.create(input);
    } finally {
      loading.value = false;
    }
  };

  const updateStatus = async (id: string, input: UpdateBooking) => {
    loading.value = true;
    try {
      return await bookingApi.updateStatus(id, input);
    } finally {
      loading.value = false;
    }
  };
  const updateById = async (id: string, input: UpdateBooking) => {
    loading.value = true;
    try {
      return await bookingApi.updateById(id, input);
    } finally {
      loading.value = false;
    }
  };

  const deleteById = async (id: string) => {
    loading.value = true;
    try {
      return await bookingApi.deleteById(id);
    } finally {
      loading.value = false;
    }
  };

  const seatIdsBooked = ref<string[]>([]);
  const getSeatsBooked = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      const res = await bookingApi.getSeatsBooked(query);

      seatIdsBooked.value = res;
      return res;
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
    deleteById,
    updateStatus,
    seatIdsBooked,
    getSeatsBooked,
  };
});
