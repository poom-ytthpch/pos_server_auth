import { CacheModule, Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserResolver } from './resolvers/user.resolver';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { RoleService } from './services/role.service';
import { RoleResolver } from './resolvers/role.resolver';
import * as redisStore from "cache-manager-redis-store"
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/jwt/constants';
@Module({
  imports: [
    PrismaModule,
    CacheModule.register({
      store: redisStore,
      url: "http://localhost",
      port: 6379
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      signOptions: { expiresIn: '1h' },
      secret: jwtConstants.secret,
    }),
  ],
  providers: [
    UserResolver,
    UserService,
    PrismaService,
    RoleResolver,
    RoleService
  ],
  exports: [
    UserService
  ],
})
export class UserModule { }
