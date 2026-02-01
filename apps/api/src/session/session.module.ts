import { Module } from "@nestjs/common";

import { SessionService } from "./session.service";

@Module({
  imports: [],
  exports: [SessionService],
  providers: [SessionService],
})
export class SessionModule {}
