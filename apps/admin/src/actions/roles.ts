"use server";

import { apiAction, safeAction } from "@/actions/common";
import {
  createRoleSchema,
  deleteRoleSchema,
  updateRoleSchema,
} from "@/lib/validation/role.schema";
import { ApiResponse, PermissionDto, RoleDto } from "@repo/shared-types";
import { updateTag } from "next/cache";

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
    const validatedData = createRoleSchema.parse(data);
    const result = await apiAction<RoleDto>("/roles", {
      method: "POST",
      body: JSON.stringify(validatedData),
      next: { tags: ["roles", "permissions"] },
    });
    updateTag("roles");
    return result;
  });
}

export async function updateRole(
  _state: ApiResponse<RoleDto> | null,
  formData: FormData,
) {
  return safeAction<RoleDto>(async () => {
    const data = Object.fromEntries(formData);
    console.log("Received data for updateRole:", data);
    const validatedData = updateRoleSchema.parse(data);
    console.log("Updating role with data:", validatedData);
    const result = await apiAction<RoleDto>(`/roles/${validatedData.id}`, {
      method: "PATCH",
      body: JSON.stringify(validatedData),
      next: { tags: ["roles", "permissions"] },
    });
    updateTag("roles");
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
    updateTag("roles");
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
