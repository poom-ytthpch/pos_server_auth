// import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Resolver, Query, Mutation, Arg, Int , Authorized} from "type-graphql"
import { UserService } from '../services/user.service';
import { User, SignUpInput, SignInInput, UserCredential } from "../types"
import { JwtAuthGuard } from 'src/common/jwt/jwt_auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Mutation(() => User, { name: "signUp" })
  signUp(@Arg('signUpInput') signUpInput: SignUpInput) {
    return this.userService.signUp(signUpInput);
  }

  @Mutation(() => UserCredential, { name: "signIn" })
  signIn(@Arg('signInInput') signInInput: SignInInput) {
    return this.userService.signIn(signInInput);
  }

  // @UseGuards(JwtAuthGuard)
  // @Authorized(JwtAuthGuard)
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  @Query(() => User, { name: 'user' })
  findOne(@Arg('id', () => Int) id: number) {
    return this.userService.findOne(id);
  }

  // @Mutation(() => User)
  // updateUser(@Args('updateUserInput') updateUserInput) {
  //   return this.userService.update(updateUserInput.id, updateUserInput);
  // }

  // @Mutation(() => User)
  // removeUser(@Args('id', { type: () => Int }) id: number) {
  //   return this.userService.remove(id);
  // }
}
