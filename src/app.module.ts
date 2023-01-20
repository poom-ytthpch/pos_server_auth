import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';
import { UserModule } from './user/user.module';
import { TypeGraphQLFederationModule } from "typegraphql-nestjs"
import * as path from 'path'
import { PrismaModule } from './common/prisma/prisma.module';
import { PrismaService } from './common/prisma/prisma.service';
import { JwtAuthGuard } from './common/jwt/jwt_auth.guard';
import { typegraphqlAuthChecker } from './common/jwt/typegraphqlAuth.guard';
import { ChatGateWay } from './chat.gateway';
import { SocketModule } from './common/socket/socket.module';
const prisma = new PrismaService

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.config.env']
    }),

    TypeGraphQLFederationModule.forRoot<ApolloFederationDriverConfig>(
      {
        driver: ApolloFederationDriver,
        // typePaths: ['./**/*.graphql'],

        dateScalarMode: 'isoDate',
        skipCheck: true,
        introspection: true,
        debug: false,
        emitSchemaFile: path.join(process.cwd(), './generated-schema.graphql'),

        playground: false,
        csrfPrevention: true,  // see below for more about this
        // cache: "bounded",
        authChecker: typegraphqlAuthChecker,
        plugins: [
          ApolloServerPluginLandingPageLocalDefault({ embed: true }),
          ApolloServerPluginInlineTraceDisabled()
        ],
        cors: {
          origin: ["https://sandbox.embed.apollographql.com", "http://localhost:4000" , "http://localhost:3000"]
        },

        context: ({ request }) => ({
          request: request,
          prisma,
          customHeaders: {
            headers: {
              ...request.headers,
            },
          }
        })

      }
    ),

    // GraphQLModule.forRoot<ApolloFederationDriverConfig>({
    //   driver: ApolloFederationDriver,
    //   // typePaths: ['./**/*.graphql'],
    //   autoSchemaFile: path.join(process.cwd(), 'generated-schema.graphql'),
    //   introspection: true,
    //   debug: false,
    //   playground: false,
    //   csrfPrevention: true,  // see below for more about this
    //   // cache: "bounded",
    //   plugins: [
    //     ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    //     ApolloServerPluginInlineTraceDisabled()
    //   ],
    //   cors: {
    //     origin: ["https://sandbox.embed.apollographql.com", "http://localhost:3000"]
    //   },
    //   context: ({ request }) => ({
    //     request: request,
    //     customHeaders: {
    //       headers: {
    //         ...request.headers,
    //       },
    //     }
    //   })
    // }),
    // AuthModule,
    UserModule,
    SocketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
