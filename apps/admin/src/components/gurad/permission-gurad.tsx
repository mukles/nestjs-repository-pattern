import { useAuth } from "@/providers/auth-provider";
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
  const { hasAnyRole, hasAnyPermission, hasRole, hasPermission } = useAuth();

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
