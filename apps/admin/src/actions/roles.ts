"use server";

import { safeAction } from "@/actions/common";
import { Permission, Role as RoleEnum } from "@repo/shared-types";
import { revalidateTag } from "next/cache";

export interface PermissionData {
  id: number;
  name: Permission;
  description: string;
}

export interface Role {
  id: number;
  name: RoleEnum | string;
  description: string;
  isActive: boolean;
  permissions: PermissionData[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  permissionIds: number[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  permissionIds?: number[];
}

// Mock Data
const MOCK_PERMISSIONS: PermissionData[] = Object.values(Permission).map(
  (name, index) => ({
    id: index + 1,
    name: name as Permission,
    description: `Allows ${name.replace(":", " ")} operations`,
  }),
);

const MOCK_ROLES: Role[] = [
  {
    id: 1,
    name: RoleEnum.SUPER_ADMIN,
    description: "Full system access with all permissions",
    isActive: true,
    permissions: MOCK_PERMISSIONS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: RoleEnum.ADMIN,
    description: "Administrative access for school management",
    isActive: true,
    permissions: MOCK_PERMISSIONS.filter((p) => !p.name.includes("super")),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Editor",
    description: "Can manage students and courses but not users",
    isActive: true,
    permissions: MOCK_PERMISSIONS.filter(
      (p) => p.name.includes("student") || p.name.includes("course"),
    ),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getRoles() {
  return safeAction<Role[]>(async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_ROLES;
  });
}

export async function getRole(id: number) {
  return safeAction<Role>(async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const role = MOCK_ROLES.find((r) => r.id === id);
    if (!role) throw new Error("Role not found");
    return role;
  });
}

export async function createRole(data: CreateRoleDto) {
  return safeAction<Role>(async () => {
    console.log("Mock Create Role:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newRole: Role = {
      id: Math.floor(Math.random() * 1000) + 10,
      name: data.name,
      description: data.description || "",
      isActive: true,
      permissions: MOCK_PERMISSIONS.filter((p) =>
        data.permissionIds.includes(p.id),
      ),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    revalidateTag("roles", "page");
    return newRole;
  });
}

export async function updateRole(id: number, data: UpdateRoleDto) {
  return safeAction<Role>(async () => {
    console.log("Mock Update Role:", id, data);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const role = MOCK_ROLES.find((r) => r.id === id);
    if (!role) throw new Error("Role not found");

    const updatedRole: Role = {
      ...role,
      name: data.name ?? role.name,
      description: data.description ?? role.description,
      isActive: data.isActive ?? role.isActive,
      permissions: data.permissionIds
        ? MOCK_PERMISSIONS.filter((p) => data.permissionIds?.includes(p.id))
        : role.permissions,
      updatedAt: new Date().toISOString(),
    };

    revalidateTag("roles", "page");
    revalidateTag(`role-${id}`, "page");
    return updatedRole;
  });
}

export async function deleteRole(id: number) {
  return safeAction<void>(async () => {
    console.log("Mock Delete Role:", id);
    await new Promise((resolve) => setTimeout(resolve, 800));
    revalidateTag("roles", "page");
  });
}

export async function getPermissions() {
  return safeAction<PermissionData[]>(async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return MOCK_PERMISSIONS;
  });
}
