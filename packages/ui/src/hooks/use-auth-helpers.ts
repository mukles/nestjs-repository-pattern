import { User } from '@repo/shared-types';
import { Permission, Role } from '../constants/roles-permissions';
import { AuthHelpers } from '../types/auth';

export const useAuthHelpers = (user: User | null): AuthHelpers => {
  const hasRole = (role: Role) => user?.role?.name === role;

  const hasAnyRole = (roles: Role[]) =>
    roles.length === 0 || roles.some((role) => hasRole(role));

  const hasPermission = (permission: Permission) => {
    // Check if any of the user's role permissions match the required permission
    const permissions = user?.role?.permissions || [];
    return permissions.some((p) => p.name === permission);
  };

  const hasAnyPermission = (permissions: Permission[]) =>
    permissions.length === 0 ||
    permissions.some((permission) => hasPermission(permission));

  return {
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
  };
};
