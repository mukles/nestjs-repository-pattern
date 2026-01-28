'use client';

import { Permission, Role } from '@repo/ui/constants/roles-permissions';
import React from 'react';

type PermissionGuardProps = {
  children: React.ReactNode;
  roles?: Role[];
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
};

export function PermissionGuard({
  children,
  roles = [],
  permissions = [],
  requireAll = false,
  fallback = null,
}: PermissionGuardProps) {
  function hasRole(role: Role) {
    return true;
  }

  function hasAnyRole(roles: Role[]) {
    return true;
  }

  function hasPermission(permission: Permission) {
    return true;
  }

  function hasAnyPermission(permissions: Permission[]) {
    return true;
  }

  const hasRequiredRoles =
    roles.length === 0 ||
    (requireAll ? roles.every((role) => hasRole(role)) : hasAnyRole(roles));

  const hasRequiredPermissions =
    permissions.length === 0 ||
    (requireAll
      ? permissions.every((permission) => hasPermission(permission))
      : hasAnyPermission(permissions));

  if (hasRequiredRoles && hasRequiredPermissions) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

export default PermissionGuard;
