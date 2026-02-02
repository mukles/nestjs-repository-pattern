"use server";

import { apiAction, safeAction } from "@/actions/common";
import {
  createRoleSchema,
  deleteRoleSchema,
  updateRoleSchema,
} from "@/lib/validation/role.schema";
import { ApiResponse, PermissionDto, RoleDto } from "@repo/shared-types";

export async function getRoles() {
  return safeAction<RoleDto[]>(async () => {
    return apiAction<RoleDto[]>("/roles", {
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
    const permissionIds = formData.getAll("permissionIds").map(Number);
    const isActive = formData.get("isActive") === "true";
    const validatedData = createRoleSchema.parse({
      ...data,
      permissionIds,
      isActive,
    });
    const result = await apiAction<RoleDto>("/roles", {
      method: "POST",
      body: JSON.stringify(validatedData),
      next: { tags: ["roles", "permissions"] },
    });
    return result;
  });
}

export async function updateRole(
  _state: ApiResponse<RoleDto> | null,
  formData: FormData,
) {
  return safeAction<RoleDto>(async () => {
    const data = Object.fromEntries(formData);
    const permissionIds = formData.getAll("permissionIds").map(Number);
    const isActive = formData.get("isActive") === "true";
    const validatedData = updateRoleSchema.parse({
      ...data,
      permissionIds,
      isActive,
    });
    const { id, ...updateData } = validatedData;
    const result = await apiAction<RoleDto>(`/roles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
      next: { tags: ["roles", "permissions"] },
    });
    return result;
  });
}

export async function deleteRole(
  _state: ApiResponse<RoleDto> | null,
  formData: FormData,
) {
  return safeAction<RoleDto>(async () => {
    const validatedData = deleteRoleSchema.parse(Object.fromEntries(formData));
    const result = await apiAction<RoleDto>(`/roles/${validatedData.id}`, {
      method: "DELETE",
      next: { tags: ["roles", "permissions"] },
    });
    return result;
  });
}

export async function getPermissions() {
  return safeAction<PermissionDto[]>(async () => {
    return apiAction<PermissionDto[]>("/roles/permissions", {
      method: "GET",
      next: { tags: ["roles", "permissions"] },
    });
  });
}
