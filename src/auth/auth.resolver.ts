import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { JwtAuthGuard } from 'src/common/jwt/jwt_auth.guard';
import { UseGuards } from '@nestjs/common';

import * as types from 'src/types/graphql/graphql';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query('user')
  @UseGuards(JwtAuthGuard)
  user(@Args('email') email: string): Promise<types.User> {
    return this.authService.user(email);
  }

  @Query('users')
  @UseGuards(JwtAuthGuard)
  users(): Promise<types.User[]> {
    return this.authService.users();
  }

  @Mutation('createRole')
  createRole(@Args('createRoleInput') createRoleInput:types.CreateRoleInput):Promise<types.Role>{
    return this.authService.createRole(createRoleInput)
  }

  @Mutation('signUp')
  signUp(
    @Args('signUpInput') signUpInput: types.SignUpInput,
  ): Promise<types.User> {
    return this.authService.signUp(signUpInput);
  }

  @Mutation('signIn')
  signIn(
    @Args('signInInput') signInInput: types.SignInInput,
  ): Promise<types.User> {
    return this.authService.signIn(signInInput);
  }

  @Mutation('updateUser')
  updateUser(
    @Args('updateUserInput') updateUserInput: types.UpdateUserInput,
  ): Promise<types.User> {
    return this.authService.updateUser(updateUserInput.id, updateUserInput);
  }
}
