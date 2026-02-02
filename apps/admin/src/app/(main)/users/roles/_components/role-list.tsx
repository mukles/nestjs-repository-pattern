"use client";

import { PermissionData, Role } from "@/actions/roles";
import { RoleDataTable } from "./role-data-table";

interface RoleListProps {
  roles: Role[];
  permissions: PermissionData[];
}

export function RoleList({ roles, permissions }: RoleListProps) {
  return <RoleDataTable data={roles} permissions={permissions} />;
}
