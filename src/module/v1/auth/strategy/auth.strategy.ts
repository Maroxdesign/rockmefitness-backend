import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { environment } from 'src/common/config/environment';
import { UserService } from '../../user/user.service';
import { TokenService } from '../../token/token.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private reflector: Reflector,
    private tokenService: TokenService,
  ) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.JWT.SECRET,
    });
  }

  async validate(req: Request, payload: any) {
    const token = req.headers.authorization.replace('Bearer ', '');
    const user = await this.userService.fullUserDetails({ _id: payload._id });
    if (!user) {
      throw new UnauthorizedException({ error: user }, 'Session expired.');
    }
    const [validateToken, clearBadUsers] = await Promise.all([
      this.tokenService.findOne({ user: payload._id, token }),
      this.tokenService.clear(),
    ]);
    if (!validateToken) {
      throw new UnauthorizedException('Session expired.');
    }
    return user;
  }
}
