import { Role as RoleEnum } from "../constants/roles.js";
import { PermissionDto } from "../permissions/permission.interface.js";

export interface CreateRoleDto {
  name: string;
  description?: string;
  permissionIds?: number[];
}

export interface RoleDto {
  id: number;
  totalUsers: number;
  name: RoleEnum | string;
  description: string;
  isActive: boolean;
  isSystem: boolean;
  permissions: PermissionDto[];
  createdAt: Date;
  updatedAt: Date;
}
