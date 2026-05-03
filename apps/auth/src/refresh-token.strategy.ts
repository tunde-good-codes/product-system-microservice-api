import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("JWT_REFRESH_SECRET")
    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {
    const header = req.headers.authorization;

    if (!header) {
      throw new UnauthorizedException("no header for this request");
    }

    const refreshToken = header.replace("Bearer", "").trim();

    const user = await this.userRepository.findOne({
      where: {
        id: payload.sub
      },
      select: {
        id: true,
        email: true,
        refreshToken: true,
        name: true
      }
    });

    if (!user || !user?.refreshToken) {
      throw new UnauthorizedException("no user with this token");
    }

    const isRefreshTokenMatch = await bcrypt.compare(user?.refreshToken, refreshToken);

    if (!isRefreshTokenMatch) {
      throw new UnauthorizedException("refresh token mismatched!");
    }

    return { id: user?.id, email: user?.email, role: user?.role };
  }
}
