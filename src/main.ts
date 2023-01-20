import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';


import { Transport, MicroserviceOptions } from "@nestjs/microservices"
import * as path from "path"
import * as cors from 'fastify-cors';


async function bootstrap() {
  const port = Number(process.env.PORT)
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const grpcUrl = `0.0.0.0:8011` // ${config.corporate.grpc.port}
  const grpcServer = await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: grpcUrl,
      package: ['user'],
      protoPath: [path.join(__dirname, './common/proto/server/user.proto')],
    },
  })

  // await grpcServer.listen().then(() => { console.log(`gRPC server is listening at ${grpcUrl}`) })
  // app.register(cors, { origin: 'http://localhost:3000' });


  await app.listen(port, '0.0.0.0').then(() => {
    console.log(`http://localhost:${port}`)
  });
}
bootstrap();
