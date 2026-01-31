import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Role } from "role/enums/role.enum";
import { UserEntity } from "user/entities/user.entity";

import { IDataService } from "../repositories/interfaces/dataservice.interface";
import { SessionService } from "../session/session.service";
import { UserStatus } from "../user/enums/user-status.enum";
import { UserService } from "../user/user.service";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./interface/jwt-interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly dataService: IDataService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto, req: Request): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.dataService.users
      .createQueryBuilder("user")
      .addSelect("user.password")
      .leftJoinAndSelect("user.roles", "roles")
      .leftJoinAndSelect("roles.permissions", "permissions")
      .where("user.email = :email", { email })
      .getOne();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (user.status === UserStatus.BANNED) {
      const message = user.banReason
        ? `Your account has been banned. Reason: ${user.banReason}`
        : "Your account has been banned";
      throw new UnauthorizedException(message);
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException("Your account is inactive");
    }

    if (user.status === UserStatus.PENDING) {
      throw new UnauthorizedException("Your account is pending activation");
    }

    const session = await this.sessionService.createSession(
      user.id.toString(),
      req.headers["user-agent"],
      req.ip,
    );

    const tokens = await this.generateTokens(user, session.sessionId);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async register(
    registerDto: RegisterDto,
    req: Request,
  ): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = registerDto;

    const existingUser = await this.dataService.users.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException("User with this email already exists");
    }

    const studentRole = await this.dataService.roles.findOne({
      where: { name: Role.STUDENT },
    });

    if (!studentRole) {
      throw new NotFoundException("Student role not found");
    }

    const user = this.dataService.users.create({
      email,
      password,
      firstName,
      lastName,
      roles: [studentRole],
    });

    const savedUser = await this.dataService.users.save(user);
    const session = await this.sessionService.createSession(
      savedUser.id.toString(),
      req.headers["user-agent"],
      req.ip,
    );

    const tokens = await this.generateTokens(savedUser, session.sessionId);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  public async refreshTokens(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    try {
      const { sessionId, user } = await this.validateRefreshToken(
        refreshTokenDto.refreshToken,
      );

      await this.sessionService.deleteSession(sessionId);
      const newSession = await this.sessionService.createSession(
        user.id.toString(),
      );

      return this.generateTokens(user, newSession.sessionId);
    } catch (err) {
      if (err && typeof err === "object" && "status" in err) throw err;
      if (err && typeof err === "object" && "name" in err) {
        if (err.name === "JsonWebTokenError") {
          throw new UnauthorizedException("Invalid refresh token");
        }
        if (err.name === "TokenExpiredError") {
          throw new UnauthorizedException("Refresh token expired");
        }
      }

      throw new InternalServerErrorException(
        "Something went wrong while refreshing token",
      );
    }
  }

  async logout(refreshTokenDto: RefreshTokenDto): Promise<{ message: string }> {
    const { sessionId } = await this.validateRefreshToken(
      refreshTokenDto.refreshToken,
    );
    await this.sessionService.deleteSession(sessionId);
    return {
      message: "User logged out successfully",
    };
  }

  private async generateTokens(user: UserEntity, sessionId: string) {
    const payload: JwtPayload = {
      id: user.id.toString(),
      sessionId,
      email: user.email,
      roles: user.roles.map((role) => role.name),
      permissions: Array.from(
        new Set(
          user.roles.flatMap((role) =>
            role.permissions
              .filter((perm) => perm.isActive)
              .map((perm) => perm.name),
          ),
        ),
      ),
    };

    const accessTokenExpiry = parseInt(
      this.configService.get<string>("JWT_EXPIRES_IN") || "900",
      10,
    );

    const refreshTokenExpiry = parseInt(
      this.configService.get<string>("JWT_REFRESH_EXPIRES_IN") || "604800",
      10,
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<JwtPayload>>(user.id, accessTokenExpiry, payload),
      this.signToken(user.id, refreshTokenExpiry, { sessionId }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async validateRefreshToken(refreshToken: string) {
    const { sessionId } = await this.jwtService.verifyAsync<
      Pick<JwtPayload, "sessionId">
    >(refreshToken, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      audience: this.configService.get<string>("JWT_AUDIENCE"),
      issuer: this.configService.get<string>("JWT_ISSUER"),
    });

    const session = await this.sessionService.validateSession(sessionId);

    const user = await this.userService.findById(session.user.id);

    if (!user) {
      await this.sessionService.deleteSession(session.sessionId);
      throw new UnauthorizedException("User not found");
    }

    return { id: session.id, sessionId: session.sessionId, user };
  }

  private async signToken<T>(
    userId: number,
    expiresIn: number,
    payload?: T,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.configService.get<string>("JWT_AUDIENCE"),
        issuer: this.configService.get<string>("JWT_ISSUER"),
        secret: this.configService.get<string>("JWT_SECRET"),
        expiresIn,
      },
    );
  }

  public async validateToken(jwtPayload: JwtPayload) {
    const user = await this.dataService.users.findOne({
      where: { id: parseInt(jwtPayload.id, 10) },
      relations: ["roles"],
    });

    if (!user) {
      const { id } = await this.sessionService.validateSession(
        jwtPayload.sessionId,
      );

      if (!id) {
        throw new UnauthorizedException("Invalid token");
      }

      await this.sessionService.deleteSession(id);

      throw new UnauthorizedException("Invalid token");
    }

    return user;
  }
}
