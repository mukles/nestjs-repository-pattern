import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IDataService } from '../repositories/interfaces/dataservice.interface';

import { Permission } from '../role/enums/permission.enum';
import { Role } from '../role/enums/role.enum';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interface/jwt-interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataService: IDataService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.dataService.users.findOne({
      where: { email },
      relations: ['role', 'role.permissions'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
      },
      ...tokens,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, roleId } = registerDto;

    const existingUser = await this.dataService.users.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    const role = await this.dataService.roles.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const user = this.dataService.users.create({
      email,
      password,
      firstName,
      lastName,
      role,
    });

    const savedUser = await this.dataService.users.save(user);

    const tokens = await this.generateTokens(
      savedUser.id,
      savedUser.email,
      role,
    );

    await this.updateRefreshToken(savedUser.id, tokens.refreshToken);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: role.name,
      },
      ...tokens,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      const user = await this.dataService.users.findOne({
        where: { id: payload.sub },
        relations: ['role', 'role.permissions'],
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Access denied');
      }

      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Access denied');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);

      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number) {
    await this.dataService.users.update(userId, { refreshToken: null });
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(
    userId: number,
    email: string,
    role: { name: Role; permissions: { name: Permission }[] },
  ) {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role: [role.name],
      permissions: role.permissions?.map((p) => p.name) ?? [],
    };

    const accessTokenExpiry = parseInt(
      this.configService.get<string>('JWT_EXPIRES_IN') || '900',
      10,
    );

    const refreshTokenExpiry = parseInt(
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '604800',
      10,
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: accessTokenExpiry,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshTokenExpiry,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
    };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.dataService.users.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
