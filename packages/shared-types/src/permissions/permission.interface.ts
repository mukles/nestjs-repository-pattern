import { Permission } from "../constants/permissions.js";

export interface PermissionDto {
  id: number;
  name: Permission;
  description: string;
  isActive: boolean;
}
