import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/jwt/constants';
import { ClientsModule, Transport } from '@nestjs/microservices'
import * as path from "path"
@Module({
  imports: [
    // ClientsModule.register([{
    //   name: 'DEVICE_PACKAGE',
    //   transport: Transport.GRPC,
    //   options: {
    //     url: "0.0.0.0:8002",
    //     package: ['device'],
    //     protoPath: [path.join(__dirname, '../common/proto/client/device.proto')],
    //   },
    // },]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      signOptions: { expiresIn: '1h' },
      secret: jwtConstants.secret,
    }),
  ],
  providers: [AuthResolver, AuthService, PrismaService],
  controllers: [AuthService]
})
export class AuthModule { }
