"use server";

import { apiAction, safeAction } from "@/actions/common";
import {
  createRoleSchema,
  deleteRoleSchema,
  updateRoleSchema,
} from "@/lib/validation/role.schema";
import { ApiResponse, PermissionDto, RoleDto } from "@repo/shared-types";
import { revalidateTag } from "next/cache";

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
    return await apiAction("/roles", {
      method: "POST",
      body: JSON.stringify(validatedData),
      next: { tags: ["roles", "permissions"] },
    });
  });
}

export async function updateRole(
  _state: ApiResponse<RoleDto> | null,
  formData: FormData,
) {
  return safeAction<RoleDto>(async () => {
    const data = Object.fromEntries(formData);
    const validatedData = updateRoleSchema.parse(data);
    return apiAction(`/roles/${validatedData.id}`, {
      method: "PATCH",
      body: JSON.stringify(validatedData),
      next: { tags: ["roles", "permissions"] },
    });
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
    revalidateTag("roles", "page");
    return result;
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
