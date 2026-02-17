import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useImageUpload } from "../hooks/use-image-upload";
import { cn } from "../lib/utils";
import { Button } from "./ui-kit/button";
import { Heading } from "./ui-kit/heading";

interface ImageUploaderProps {
  /**
   * Variant of the uploader: 'default' (drag & drop) or 'form' (avatar style)
   */
  variant?: "default" | "form";
  image?: string;
  onChange?: (file: File | string) => void;
  fileSetting: {
    acceptedImageTypes: Record<string, string[]>;
    errorMessages: {
      maxUploadSize: string;
      acceptedImageTypes: string;
    };
    description: string;
    maxUploadSize: number;
  };
}

export function ImageUploader({
  image,
  onChange,
  fileSetting,
  variant = "default",
}: ImageUploaderProps) {
  const [existingImage, setExistingImage] = useState<string | null>(
    image || null,
  );

  useEffect(() => {
    if (!existingImage) {
      setExistingImage(image || null);
    }
  }, [image]);

  const {
    previewUrls,
    getRootProps,
    getInputProps,
    isDragActive,
    removeImage,
    hasImages,
  } = useImageUpload({
    onUpload(files) {
      if (files && files.length > 0) {
        setExistingImage(null);
        if (files[0]) {
          onChange?.(files[0]);
        }
      } else {
        onChange?.("");
      }
    },

    accept: fileSetting.acceptedImageTypes,
    maxSize: fileSetting.maxUploadSize,
  });

  const handleRemoveImage = () => {
    if (hasImages) {
      removeImage(0);
      setExistingImage(null);
      onChange?.("");
    } else {
      onChange?.("");
      setExistingImage(null);
    }
  };

  const displayImage = hasImages ? previewUrls[0] : existingImage!;
  const showImagePreview = hasImages || existingImage;

  if (variant === "form") {
    // Form/Avatar style variant
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "group relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-slate-300",
            )}
            onClick={() =>
              document.getElementById("photo-upload-form-variant")?.click()
            }
          >
            {showImagePreview ? (
              <img
                src={displayImage!}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <svg
                className="h-6 w-6 text-slate-300 transition-colors group-hover:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
            <input
              id="photo-upload-form-variant"
              type="file"
              accept={Object.values(fileSetting.acceptedImageTypes)
                .flat()
                .join(",")}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setExistingImage(null);
                  onChange?.(file);
                } else {
                  onChange?.("");
                }
              }}
            />
          </div>
          <div className="space-y-1 text-sm text-slate-500">
            <Button
              type="button"
              variant="link"
              onClick={() =>
                document.getElementById("photo-upload-form-variant")?.click()
              }
            >
              Upload photo
            </Button>
            <p className="text-xs text-slate-400">
              {Object.values(fileSetting.acceptedImageTypes)
                .flat()
                .join(" or ")
                .toUpperCase()}{" "}
              · Max {fileSetting.maxUploadSize / (1024 * 1024)}MB · 1:1 ratio
            </p>
            {showImagePreview && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleRemoveImage}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default drag & drop variant
  return (
    <div className={cn("mt-3 space-y-4")}>
      {!showImagePreview ? (
        <div {...getRootProps()}>
          <div
            className={cn(
              "relative h-[148px] rounded border-2 border-dashed border-[#D3D5E4] px-3 dark:border-border",
              isDragActive ? "bg-[#F8F9FF]" : "bg-transparent",
            )}
          >
            <div className="flex h-full w-full flex-col items-center justify-center">
              <div className="mb-2 flex size-10 items-center justify-center rounded bg-muted">
                <Upload className="text-secondary-foreground" />
              </div>
              <Heading variant={"h6"} className="text-center">
                Drag & drop files or browse files
              </Heading>
              <p className="mt-1 text-center text-sm tracking-[0.5px] text-[#656B9F]">
                {fileSetting.description}
              </p>
            </div>
            <input
              type="file"
              className="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0"
              {...getInputProps()}
            />
          </div>
        </div>
      ) : (
        <div className="relative max-h-[70svh] overflow-hidden overflow-y-auto rounded-lg border p-0.5 text-center">
          <div className="mx-auto inline-block p-1 text-center">
            <img
              src={displayImage!}
              alt="Preview"
              className="mx-auto h-auto w-auto rounded object-cover"
              width={600}
              height={338}
            />
          </div>
          <Button type="button" onClick={handleRemoveImage} size={"icon"}>
            <X className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
