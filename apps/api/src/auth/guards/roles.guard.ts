import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { Role } from "../../role/enums/role.enum";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { AuthenticatedRequest } from "../interface/jwt-interface";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userRoles = request.user?.roles || [];

    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
