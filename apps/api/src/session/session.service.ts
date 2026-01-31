import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { randomUUID } from "crypto";
import { IDataService } from "repositories/interfaces/dataservice.interface";
import { UserEntity } from "user/entities/user.entity";

import { SessionDto } from "./dto/session.dto";

@Injectable()
export class SessionService {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataService: IDataService,
  ) {}

  async createSession(
    userId: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<SessionDto> {
    const refreshTTL =
      this.configService.get<number>("JWT_REFRESH_EXPIRES_IN") ?? 86400;
    const expiresAt = new Date(Date.now() + refreshTTL * 1000);

    const sessionId = randomUUID();
    const refreshToken = randomUUID();

    const sessionEntry = this.dataService.sessions.create({
      sessionId,
      user: { id: userId as unknown as number } as UserEntity,
      refreshToken,
      userAgent,
      ipAddress,
      expiresAt,
    });

    await this.dataService.sessions.save(sessionEntry);

    return {
      sessionId: sessionId,
      userId,
      refreshToken,
      userAgent: userAgent || "",
      ipAddress: ipAddress || "",
    };
  }

  async validateSession(sessionId: string) {
    const session = await this.dataService.sessions.findOne({
      where: { sessionId },
      relations: ["user"],
    });
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired session");
    }
    return session;
  }

  async updateSession(sessionId: string): Promise<SessionDto> {
    const session = await this.dataService.sessions.findOne({
      where: { sessionId },
      relations: ["user"],
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired session");
    }

    const refreshTTL =
      this.configService.get<number>("JWT_REFRESH_EXPIRES_IN") ?? 86400;
    const newExpiresAt = new Date(Date.now() + refreshTTL * 1000);
    const newRefreshToken = randomUUID();

    session.expiresAt = newExpiresAt;
    session.refreshToken = newRefreshToken;

    await this.dataService.sessions.save(session);

    return {
      sessionId: session.sessionId,
      userId: session.user.id.toString(),
      refreshToken: newRefreshToken,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
    };
  }

  async deleteSession(sessionId: string) {
    const session = await this.dataService.sessions.findOne({
      where: { sessionId },
    });
    if (!session) {
      throw new UnauthorizedException("Invalid session");
    }

    await this.dataService.sessions.remove(session);
    return { message: "Session deleted successfully" };
  }
}
