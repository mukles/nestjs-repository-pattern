import { User } from "@repo/shared-types";
import { Permission, Role } from "../constants/roles-permissions";

export type AuthStatus = "authenticated" | "unauthenticated" | "loading";

export interface AuthSession {
  user: User | null;
  status: AuthStatus;
  error: string | null;
}

export interface AuthHelpers {
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
}

export interface AuthContextValue extends AuthHelpers {
  session: AuthSession | null;
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (session: AuthSession | null) => void;
  updateSession: () => void;
  logout: () => void;
}
