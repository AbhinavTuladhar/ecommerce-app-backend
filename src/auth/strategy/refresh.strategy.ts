import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        RefreshTokenStrategy.extractJWT,
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  private static extractJWT(req: Request) {
    if (req.cookies && 'refreshToken' in req.cookies) {
      return req.cookies.refreshToken;
    }
    return null;
  }

  async validate(request: Request, payload: any) {
    // Try to extract from cookie first
    let refreshToken = RefreshTokenStrategy.extractJWT(request);

    if (!refreshToken && request.headers['authorization']) {
      refreshToken = request.headers['authorization']
        .replace('Bearer', '')
        .trim();
    }

    return { ...payload, refreshToken };
  }
}
