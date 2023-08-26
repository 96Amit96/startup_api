import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport/dist/passport/passport.strategy';
import { UserService } from 'src/models/user/user.service';
import { APP_CONSTANT } from 'src/common/constants/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: APP_CONSTANT.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const id = payload.sub;
    const user = await this.userService.getById(id);
    return {
      userId: payload.sub,
      username: payload.username,
    };
  }
}