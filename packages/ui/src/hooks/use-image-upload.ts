import { useCallback, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";

interface UseImageUploadOptions {
  accept?: DropzoneOptions["accept"];
  maxSize?: number;
  multiple?: boolean;
  onUpload?: (files: File[]) => void;
}

interface UseImageUploadReturn {
  previewUrls: string[];
  files: File[];
  getRootProps: ReturnType<typeof useDropzone>["getRootProps"];
  getInputProps: ReturnType<typeof useDropzone>["getInputProps"];
  isDragActive: boolean;
  removeImage: (index: number) => void;
  removeAllImages: () => void;
  hasImages: boolean;
}

export function useImageUpload(
  options: UseImageUploadOptions = {},
): UseImageUploadReturn {
  const {
    accept = { "image/*": [".jpg", ".jpeg", ".png", ".gif"] },
    maxSize = 2 * 1024 * 1024,
    multiple = false,
    onUpload,
  } = options;

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const newUrls = acceptedFiles.map((file) => URL.createObjectURL(file));

      if (multiple) {
        setPreviewUrls((prev) => [...prev, ...newUrls]);
        setFiles((prev) => [...prev, ...acceptedFiles]);
      } else {
        if (previewUrls.length > 0) {
          previewUrls.forEach((url) => URL.revokeObjectURL(url));
        }
        setPreviewUrls(newUrls);
        setFiles(acceptedFiles);
      }

      onUpload?.(acceptedFiles);
    },
    [multiple, onUpload, previewUrls],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
  });

  const removeImage = useCallback(
    (index: number) => {
      if (previewUrls[index]) {
        URL.revokeObjectURL(previewUrls[index]);
      }
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
      setFiles((prev) => prev.filter((_, i) => i !== index));
    },
    [previewUrls],
  );

  const removeAllImages = useCallback(() => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setFiles([]);
  }, [previewUrls]);

  return {
    previewUrls,
    files,
    getRootProps,
    getInputProps,
    isDragActive,

    removeImage,
    removeAllImages,
    hasImages: previewUrls.length > 0,
  };
}
