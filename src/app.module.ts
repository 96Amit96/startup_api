import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/app/configuration';
import { validationSchema } from './config/app/validation_schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/database/mysql.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './models/user/user.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/env/${process.env.APP_ENV}.env`,
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),

    AuthModule,
    UserModule,
   
  ],
})
export class AppModule {}