import { ConfigService } from "@nestjs/config";

import { StorageProvider } from "./interfaces/storage-provider.interface";
import { LocalStorage } from "./providers/local.storage";
import { R2Storage } from "./providers/r2.storage";

export const createStorageFactory = (config: ConfigService) => {
  const driver = config.get<string>("STORAGE_DRIVER")?.toLowerCase() || "local";

  return (): StorageProvider => {
    switch (driver) {
      case "r2":
        return new R2Storage(
          config.get<string>("R2_BUCKET")!,
          config.get<string>("R2_ACCESS_KEY")!,
          config.get<string>("R2_SECRET_KEY")!,
          config.get<string>("R2_REGION")!,
          config.get<string>("R2_CDN_URL"),
        );

      case "local":
      default: {
        const basePath = config.get<string>("LOCAL_STORAGE_PATH") || "uploads";
        const publicUrl =
          config.get<string>("LOCAL_STORAGE_URL") ||
          "http://localhost:3000/uploads";
        return new LocalStorage(basePath, publicUrl);
      }
    }
  };
};
