import { busCompanyApi } from "~/apis/futabus/bus_company.api";
import type { PaginateResponse } from "~/types/paginate-response.type";
import type { PaginationParams } from "~/utils/types/fetch.types";
import type {
  BusCompany,
  CreateBusCompany,
  UpdateBusCompany,
} from "~/validations/admin/bus_company.validation";

export const useBusCompanyStore = defineStore("busCompany", () => {
  const loading = ref(false);
  const list = ref<BusCompany[]>([]);
  const paginate = ref<PaginateResponse<BusCompany> | null>(null);
  const selected = ref<BusCompany | null>(null);

  const fetchAll = async () => {
    loading.value = true;
    try {
      list.value = await busCompanyApi.getAll();
      return list.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchPaginate = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      paginate.value = await busCompanyApi.paginate(query);
      return paginate.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string) => {
    selected.value = await busCompanyApi.getById(id);
    return selected.value;
  };

  const create = async (input: CreateBusCompany) => {
    loading.value = true;
    try {
      return await busCompanyApi.create(input);
    } finally {
      loading.value = false;
    }
  };

  const updateById = async (id: string, input: UpdateBusCompany) => {
    loading.value = true;
    try {
      return await busCompanyApi.updateById(id, input);
    } finally {
      loading.value = false;
    }
  };

  const deleteById = async (id: string) => {
    loading.value = true;
    try {
      return await busCompanyApi.deleteById(id);
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
  };
});
