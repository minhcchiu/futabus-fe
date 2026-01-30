import { uploadApi } from "~/apis/pre-built/11-upload.api";
import type { ImageSize } from "~/utils/enums";

export const useUploadStore = defineStore("upload", () => {
  const uploadFiles = async (input: {
    file: File[];
    imageSizes?: ImageSize[];
  }) => {
    return await uploadApi.uploadFiles(input);
  };

  const uploadFile = async (input: {
    file: File;
    imageSizes?: ImageSize[];
  }) => {
    return await uploadApi.uploadFile(input);
  };

  return {
    uploadFiles,
    uploadFile,
  };
});
