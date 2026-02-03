import { sepayApi } from "~/apis/futabus/sepay.api";
import type { PaginateResponse } from "~/types/paginate-response.type";
import type { PaginationParams } from "~/utils/types/fetch.types";
import type {
  CreateSepay,
  GenerateQrCode,
  Sepay,
  UpdateSepay,
} from "~/validations/admin/sepay.validation";

export const useSepayStore = defineStore("sepay", () => {
  const loading = ref(false);
  const list = ref<Sepay[]>([]);
  const paginate = ref<PaginateResponse<Sepay> | null>(null);
  const selected = ref<Sepay | null>(null);

  const fetchAll = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      list.value = await sepayApi.getAll(query);
      return list.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchPaginate = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      paginate.value = await sepayApi.paginate(query);
      return paginate.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string) => {
    selected.value = await sepayApi.getById(id);
    return selected.value;
  };

  const fetchOne = async () => {
    selected.value = await sepayApi.getOne();
    return selected.value;
  };

  const generateQRCode = async (input: GenerateQrCode) => {
    loading.value = true;
    try {
      return await sepayApi.generateQRCode(input);
    } finally {
      loading.value = false;
    }
  };

  const create = async (input: CreateSepay) => {
    loading.value = true;
    try {
      return await sepayApi.create(input);
    } finally {
      loading.value = false;
    }
  };

  const updateById = async (id: string, input: UpdateSepay) => {
    loading.value = true;
    try {
      return await sepayApi.updateById(id, input);
    } finally {
      loading.value = false;
    }
  };

  const deleteManyByIds = async (ids: string[]) => {
    loading.value = true;
    try {
      return await sepayApi.deleteManyByIds(ids);
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
    fetchOne,
    generateQRCode,
    create,
    updateById,
    deleteManyByIds,
  };
});
