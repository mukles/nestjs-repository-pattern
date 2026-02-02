import { Permission, Role } from "@repo/shared-types";

interface PermissionGuardProps {
  children: React.ReactNode;
  roles?: Role[];
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  roles = [],
  permissions = [],
  requireAll = false,
  fallback = null,
}: PermissionGuardProps) {
  // TODO: Replace these stub implementations with your actual logic or import them from your auth/context/hooks
  const hasAnyRole = (_roles: Role[]) => false;
  const hasAnyPermission = (_permissions: Permission[]) => false;
  const hasRole = (_role: Role) => false;
  const hasPermission = (_permission: Permission) => false;

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
