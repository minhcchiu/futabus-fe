import { vehicleApi } from "~/apis/futabus/vehicle.api";
import type { PaginateResponse } from "~/types/paginate-response.type";
import type { PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateVehicle,
  UpdateVehicle,
  Vehicle,
} from "../validations/admin/vehicle.validation";

export const useVehicleStore = defineStore("vehicle", () => {
  const loading = ref(false);
  const list = ref<Vehicle[]>([]);
  const paginate = ref<PaginateResponse<Vehicle> | null>(null);
  const selected = ref<Vehicle | null>(null);

  const fetchAll = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      list.value = await vehicleApi.getAll(query);
      return list.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchPaginate = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      paginate.value = await vehicleApi.paginate(query);
      return paginate.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string) => {
    selected.value = await vehicleApi.getById(id);
    return selected.value;
  };

  const create = async (input: CreateVehicle) => {
    loading.value = true;
    try {
      return await vehicleApi.create(input);
    } finally {
      loading.value = false;
    }
  };

  const updateById = async (id: string, input: UpdateVehicle) => {
    loading.value = true;
    try {
      return await vehicleApi.updateById(id, input);
    } finally {
      loading.value = false;
    }
  };

  const deleteByIds = async (ids: string[]) => {
    loading.value = true;
    try {
      return await vehicleApi.deleteManyByIds(ids);
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
    deleteByIds,
  };
});
