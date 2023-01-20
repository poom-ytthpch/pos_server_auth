import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthChecker, ResolverData } from 'type-graphql';
import { jwtConstants } from './constants';
import * as jwt from 'jsonwebtoken';


export const typegraphqlAuthChecker: AuthChecker<any> = (
    resolverData: ResolverData<any>,
    roles,
) => {
    const { context } = resolverData;
    const { req } = context;

    const authorizationHeader = req.headers.authorization;


    if (!authorizationHeader) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = authorizationHeader.replace('Bearer ', '');


    try {
       jwt.verify(accessToken, jwtConstants.secret);
      } catch (error) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    return true
};
