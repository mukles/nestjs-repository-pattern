import { Module } from "@nestjs/common";

import { DataServiceModule } from "../repositories/dataservice.module";
import { BatchController } from "./batch.controller";
import { BatchService } from "./batch.service";

@Module({
  imports: [DataServiceModule],
  providers: [BatchService],
  controllers: [BatchController],
  exports: [BatchService],
})
export class BatchModule {}
