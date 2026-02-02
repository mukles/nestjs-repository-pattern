"use server";

import { apiAction, safeAction } from "@/actions/common";
import { createRoleSchema } from "@/lib/validation/role.schema";
import { ApiResponse, PermissionDto, RoleDto } from "@repo/shared-types";
import { revalidateTag } from "next/cache";

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

export async function getRoles() {
  return safeAction<RoleDto[]>(async () => {
    return apiAction("/roles", {
      method: "GET",
      next: { tags: ["roles", "permissions"] },
    });
  });
}

export async function createRole(
  _state: ApiResponse<RoleDto> | null,
  formData: FormData,
) {
  return safeAction<RoleDto>(async () => {
    const data = Object.fromEntries(formData);
    const validatedData = createRoleSchema.parse(data);
    console.log(validatedData);
    return await apiAction("/roles", {
      method: "POST",
      body: JSON.stringify(validatedData),
      next: { tags: ["roles", "page"] },
    });
  });
}

export async function updateRole(id: number, data: UpdateRoleDto) {
  return safeAction<RoleDto>(async () => {
    console.log("Mock Update Role:", id, data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {} as RoleDto;
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
  return safeAction<PermissionDto[]>(async () => {
    return apiAction("/roles/permissions", {
      method: "GET",
      next: { tags: ["roles", "permissions"] },
    });
  });
}
