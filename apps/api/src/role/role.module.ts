import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PermissionEntity } from "./entities/permission.entity";
import { RoleEntity } from "./entities/role.entity";
import { RoleService } from "./role.service";

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, PermissionEntity])],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
