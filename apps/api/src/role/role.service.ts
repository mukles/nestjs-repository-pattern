import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Role as RoleEnum } from "@repo/shared-types";
import { In } from "typeorm";

import { IDataService } from "../repositories/interfaces/dataservice.interface";
import { CreateRoleDto } from "./dto/create-role.dto";
import { PermissionResponseDto } from "./dto/permission-response.dto";
import { RoleResponseDto } from "./dto/role-response.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { PermissionEntity } from "./entities/permission.entity";
import { RoleEntity } from "./entities/role.entity";

@Injectable()
export class RoleService {
  constructor(private readonly dataService: IDataService) {}

  private mapToResponse(role: RoleEntity): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      permissions: role.permissions
        ? role.permissions.map((perm) => ({
            id: perm.id,
            name: perm.name,
            description: perm.description,
            isActive: perm.isActive,
          }))
        : [],
      totalUsers: role.users ? role.users.length : 0,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      description: role.description,
      isActive: role.isActive,
    };
  }

  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.dataService.roles.find({
      relations: ["users", "permissions"],
    });

    return roles.map((role) => this.mapToResponse(role));
  }

  async findOne(id: number): Promise<RoleResponseDto> {
    const role = await this.dataService.roles.findOne({
      where: { id },
      relations: ["users", "permissions"],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return this.mapToResponse(role);
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const existingRole = await this.dataService.roles.findOne({
      where: { name: createRoleDto.name as any },
    });

    if (existingRole) {
      throw new BadRequestException(
        `Role with name ${createRoleDto.name} already exists`,
      );
    }

    let permissions: PermissionEntity[] = [];
    if (createRoleDto.permissionIds && createRoleDto.permissionIds.length > 0) {
      permissions = await this.dataService.permissions.find({
        where: { id: In(createRoleDto.permissionIds) },
      });
    }

    const role = this.dataService.roles.create({
      name: createRoleDto.name as any,
      description: createRoleDto.description,
      permissions,
      isActive: createRoleDto.isActive ?? true,
    });

    const savedRole = await this.dataService.roles.save(role);
    return this.mapToResponse(savedRole);
  }

  async updateRole(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    const role = await this.dataService.roles.findOne({
      where: { id },
      relations: ["permissions"],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    if (updateRoleDto.name) {
      const existingRole = await this.dataService.roles.findOne({
        where: { name: updateRoleDto.name as any },
      });

      if (existingRole && existingRole.id !== id) {
        throw new BadRequestException(
          `Role with name ${updateRoleDto.name} already exists`,
        );
      }
      role.name = updateRoleDto.name as any;
    }

    if (updateRoleDto.description !== undefined) {
      role.description = updateRoleDto.description;
    }

    if (updateRoleDto.isActive !== undefined) {
      role.isActive = updateRoleDto.isActive;
    }

    if (updateRoleDto.permissionIds) {
      role.permissions = await this.dataService.permissions.find({
        where: { id: In(updateRoleDto.permissionIds) },
      });
    }

    const updatedRole = await this.dataService.roles.save(role);
    return this.mapToResponse(updatedRole);
  }

  async deleteRole(id: number): Promise<RoleEntity> {
    const role = await this.dataService.roles.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return await this.dataService.roles.remove(role);
  }

  async findByName(name: RoleEnum): Promise<RoleEntity | null> {
    return this.dataService.roles.findOne({ where: { name } });
  }

  async getAllPermissionNames(): Promise<PermissionResponseDto[]> {
    const permissions = await this.dataService.permissions.find();

    return permissions.map((perm) => ({
      id: perm.id,
      name: perm.name,
      description: perm.description,
      isActive: perm.isActive,
    }));
  }
}
