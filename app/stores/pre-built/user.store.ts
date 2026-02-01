import { userApi } from "~/apis/pre-built/2-user.api";
import type { PaginateResponse } from "~/types/paginate-response.type";
import type { User } from "~/types/pre-built/2-user";
import type { PaginationParams } from "~/utils/types/fetch.types";
import type { CreateUser, UpdateUser } from "~/validations/user.validation";

export const useUserStore = defineStore("user", () => {
  const loading = ref(false);
  const list = ref<User[]>([]);
  const paginate = ref<PaginateResponse<User> | null>(null);
  const selected = ref<User | null>(null);

  const fetchAll = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      list.value = await userApi.getAll(query);
      return list.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchPaginate = async (query?: PaginationParams) => {
    loading.value = true;
    try {
      paginate.value = await userApi.paginate(query);
      return paginate.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string) => {
    selected.value = await userApi.getById(id);
    return selected.value;
  };

  const create = async (input: CreateUser) => {
    loading.value = true;
    try {
      return await userApi.create(input);
    } finally {
      loading.value = false;
    }
  };

  const updateById = async (id: string, input: UpdateUser) => {
    loading.value = true;
    try {
      return await userApi.updateById(id, input);
    } finally {
      loading.value = false;
    }
  };

  const deleteManyByIds = async (ids: string[]) => {
    loading.value = true;
    try {
      return await userApi.deleteManySoftByIds(ids);
    } finally {
      loading.value = false;
    }
  };

  const fetchMe = async () => {
    loading.value = true;
    try {
      selected.value = await userApi.getMe();
      return selected.value;
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

    fetchMe,
  };
});
