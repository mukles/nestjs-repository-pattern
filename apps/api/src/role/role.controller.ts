import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { ApiResponse } from "../common/response";
import { CreateRoleDto } from "./dto/create-role.dto";
import { PermissionResponseDto } from "./dto/permission-response.dto";
import { RoleResponseDto } from "./dto/role-response.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RoleEntity } from "./entities/role.entity";
import { RoleService } from "./role.service";

@ApiBearerAuth("JWT-auth")
@ApiTags("Role")
@Controller("roles")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse(RoleResponseDto)
  async findAll(): Promise<RoleResponseDto[]> {
    return this.roleService.findAll();
  }

  @Get("permissions")
  @HttpCode(HttpStatus.OK)
  @ApiResponse(PermissionResponseDto)
  async getAllPermissionNames(): Promise<PermissionResponseDto[]> {
    return this.roleService.getAllPermissionNames();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse(RoleResponseDto)
  async findOne(@Param("id") id: string): Promise<RoleResponseDto> {
    return this.roleService.findOne(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse(RoleResponseDto)
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<RoleResponseDto> {
    return this.roleService.createRole(createRoleDto);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse(RoleResponseDto)
  async updateRole(
    @Param("id") id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    return this.roleService.updateRole(+id, updateRoleDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse(RoleEntity)
  async deleteRole(@Param("id") id: string): Promise<RoleEntity> {
    const role = await this.roleService.deleteRole(+id);
    return role;
  }
}
