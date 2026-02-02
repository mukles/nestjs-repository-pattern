"use client";

import { User } from "@/actions/auth/user/types";
import { Permission, Role } from "@repo/shared-types";
import { createContext, ReactNode, useContext, useMemo } from "react";

interface AuthContextType {
  user: User | null;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: User | null;
}) {
  const hasPermission = (permission: Permission): boolean => {
    if (!user?.permissions) return false;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user?.permissions) return false;
    return permissions.some((permission) =>
      user.permissions?.includes(permission),
    );
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!user?.permissions) return false;
    return permissions.every((permission) =>
      user?.permissions?.includes(permission),
    );
  };

  const hasRole = (role: Role): boolean => {
    if (!user?.roles) return false;
    return user.roles.some((r) => r === role);
  };

  const hasAnyRole = (roles: Role[]): boolean => {
    if (!user?.roles) return false;
    return roles.some((role) => user.roles?.some((ur) => ur === role));
  };

  const value = useMemo(
    () => ({
      user,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      hasRole,
      hasAnyRole,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
