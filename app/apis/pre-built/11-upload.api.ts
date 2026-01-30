import type { FileUploaded, UploadedResult } from "~/types/pre-built/11-upload";
import type { ImageSize } from "~/utils/enums";
import { authFetch, guestFetch } from "~/utils/fetch";
import type { FetchOptions } from "~/utils/types/fetch.types";

const UPLOAD_URL = "/uploads";
export const uploadApi = {
  //  ----- Method: POST -----
  uploadFiles: (
    input: {
      file: File[];
      imageSizes?: ImageSize[];
    },
    options?: FetchOptions,
  ): Promise<UploadedResult> => {
    const formData = new FormData();

    input.file.forEach((file) => {
      formData.append("files", file);
    });

    input.imageSizes?.forEach((imageSize) => {
      formData.append("imageSizes", imageSize);
    });

    return authFetch.post(`${UPLOAD_URL}/files`, formData, options);
  },

  uploadFile: (
    input: {
      file: File;
      imageSizes?: ImageSize[];
    },
    options?: FetchOptions,
  ): Promise<FileUploaded> => {
    const formData = new FormData();
    formData.append("file", input.file);

    input.imageSizes?.forEach((imageSize) => {
      formData.append("imageSizes", imageSize);
    });
    return guestFetch.post(`${UPLOAD_URL}/file`, formData, options);
  },
};
