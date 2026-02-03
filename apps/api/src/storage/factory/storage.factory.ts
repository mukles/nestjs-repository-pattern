import { ConfigService } from "@nestjs/config";

import { StorageProvider } from "../interfaces/storage-provider.interface";
import { LocalStorage } from "../providers/local.storage";
import { R2Storage } from "../providers/r2.storage";
import { StorageType } from "./storage.types";

export const createStorageFactory = (config: ConfigService) => {
  const driver = config.get<string>("STORAGE_DRIVER")?.toLowerCase() || "local";

  return (type: StorageType): StorageProvider => {
    switch (driver) {
      case "r2": {
        const accessKey = config.get<string>("R2_ACCESS_KEY")!;
        const secretKey = config.get<string>("R2_SECRET_KEY")!;
        const region = config.get<string>("R2_REGION")!;
        switch (type) {
          case "public":
            return new R2Storage(
              config.get<string>("R2_PUBLIC_BUCKET")!,
              region,
              accessKey,
              secretKey,
              config.get<string>("R2_PUBLIC_CDN_URL"),
            );
          case "private":
            return new R2Storage(
              config.get<string>("R2_PRIVATE_BUCKET")!,
              region,
              accessKey,
              secretKey,
            );
          default:
            throw new Error(`Unsupported storage type: ${type}`);
        }
      }

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
