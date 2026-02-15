import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { createStorageFactory } from "./factory/storage.factory";
import { STORAGE_FACTORY } from "./storage.constants";

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: STORAGE_FACTORY,
      useFactory: (config: ConfigService) => createStorageFactory(config),
      inject: [ConfigService],
    },
  ],
  exports: [STORAGE_FACTORY],
})
export class StorageModule {}
