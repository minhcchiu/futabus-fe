import { routeApi } from "~/apis/futabus/route.api";
import type { PaginateResponse } from "~/types/paginate-response.type";
import type { PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateRoute,
  LocationsFromTo,
  Route,
  UpdateRoute,
} from "~/validations/admin/route.validation";

export const useRouteStore = defineStore("route", () => {
  const loading = ref(false);
  const list = ref<Route[]>([]);
  const paginate = ref<PaginateResponse<Route> | null>(null);
  const selected = ref<Route | null>(null);

  const fetchAll = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      list.value = await routeApi.getAll(query);
      return list.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchPaginate = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      paginate.value = await routeApi.paginate(query);
      return paginate.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string) => {
    selected.value = await routeApi.getById(id);
    return selected.value;
  };

  const create = async (input: CreateRoute) => {
    loading.value = true;
    try {
      return await routeApi.create(input);
    } finally {
      loading.value = false;
    }
  };

  const updateById = async (id: string, input: UpdateRoute) => {
    loading.value = true;
    try {
      return await routeApi.updateById(id, input);
    } finally {
      loading.value = false;
    }
  };

  const deleteManyByIds = async (ids: string[]) => {
    loading.value = true;
    try {
      return await routeApi.deleteManyByIds(ids);
    } finally {
      loading.value = false;
    }
  };

  const locationsFromTo = ref<LocationsFromTo[]>([]);
  const getLocationsFromTo = async () => {
    loading.value = true;
    try {
      locationsFromTo.value = await routeApi.getLocationsFromTo();
      return list.value;
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

    locationsFromTo,
    getLocationsFromTo,
  };
});
