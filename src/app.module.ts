import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.config.env']
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ['./**/*.graphql'],
      introspection: true,
      debug: false,
      playground: false,
      csrfPrevention: true,  // see below for more about this
      // cache: "bounded",
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        ApolloServerPluginInlineTraceDisabled()
      ],
      cors: {
        origin: ["https://sandbox.embed.apollographql.com", "http://localhost:3000"]
      },
      context: ({ request }) => ({
        request: request,
        customHeaders: {
          headers: {
            ...request.headers,
          },
        }
      })
    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
