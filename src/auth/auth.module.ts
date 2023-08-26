import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from 'src/models/user/user.service';
import { APP_CONSTANT } from 'src/common/constants/constants';
import { GoogleStrategy } from './google.strategy';
import { UserModule } from 'src/models/user/user.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: APP_CONSTANT.JWT_SECRET,
      signOptions: { expiresIn: '6h' },
    }),
    UserModule,
    PassportModule.register({ defaultStrategy: 'google' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService, GoogleStrategy],
})
export class AuthModule {}