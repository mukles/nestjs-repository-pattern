interface PermissionGuardProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
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
  const hasAnyRole = (roles: string[]) => false;
  const hasAnyPermission = (permissions: string[]) => false;
  const hasRole = (role: string) => false;
  const hasPermission = (permission: string) => false;

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
