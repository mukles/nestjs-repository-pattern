import { Permission, Role } from "@repo/shared-types";

export interface JwtPayload {
  id: string;
  email: string;
  sessionId: string;
  roles: Role[];
  permissions: Permission[];
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
