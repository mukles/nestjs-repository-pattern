import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

import { User } from '../../user/entities/user.entity';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  override handleRequest<TUser = User>(err: Error | null, user: TUser | false): TUser {
    if (err || !user) {
      throw err ?? new UnauthorizedException();
    }

    return user;
  }
}
