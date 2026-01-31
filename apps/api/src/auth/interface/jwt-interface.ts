import { Permission } from "../../role/enums/permission.enum";
import { Role } from "../../role/enums/role.enum";

export interface JwtPayload {
  id: string; // user id
  email: string;
  sessionId: string;
  roles: Role[];
  permissions: Permission[];
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
