import { Permission } from "../../role/enums/permission.enum";
import { Role } from "../../role/enums/role.enum";

export interface JwtPayload {
  sub: number;
  email: string;
  role: Role[];
  permissions: Permission[];
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
