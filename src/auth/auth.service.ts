import { Injectable, Controller, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { User, SignInInput, SignUpInput, CreateRoleInput ,Role, UpdateUserInput} from '../types/graphql/graphql';
import * as bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken"
import { JwtService } from '@nestjs/jwt';
import { stringify } from 'querystring';
import { GrpcMethod } from '@nestjs/microservices';
import { user } from 'src/types/grpc/user';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';



@Injectable()
@Controller()
export class AuthService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _jwtService: JwtService,
  ) { }

  @GrpcMethod("UserService", 'FindOne')
  async userGrpc(data: user.UserByEmail, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<user.User> {

    const { email } = data

    const res = await this._prismaService.user.findFirst({ where: { email: email }, include: { role: true } });

    if (!res) return null

    return res;
  }
  async user(email: string): Promise<User> {

    const res = await this._prismaService.user.findFirst({ where: { email: email }, include: { role: true } });

    return res as User;
  }

  async users(): Promise<User[]> {

    const res = await this._prismaService.user.findMany({ include: { role: true } });

    return res as User[];
  }

  async createRole(createRoleInput: CreateRoleInput): Promise<Role> {

    const { type } = createRoleInput

    if (await this._prismaService.role.findFirst({ where: { type } })) throw new HttpException(`Role already exist.`, HttpStatus.BAD_REQUEST,);

    const create_role = await this._prismaService.role.create({ data: createRoleInput })

    return create_role as Role
  }

  async signUp(signUpInput: SignUpInput): Promise<User> {
    const oldUser = await this._prismaService.user.findFirst({
      where: { email: signUpInput.email },
    });

    if (oldUser) {
      throw new HttpException(
        `User already exist. User ID: ${oldUser.id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const pass = await bcrypt.hash(signUpInput.password, 10);

    signUpInput.password = pass;

    const user_create = await this._prismaService.user.create({ data: signUpInput, include: { role: true } });

    return user_create as User;
  }

  async signIn(signInInput: SignInInput): Promise<User> {

    if (!(signInInput.email && signInInput.password)) throw new HttpException(`All input is required`, HttpStatus.BAD_REQUEST);

    const user = await this._prismaService.user.findFirst({
      where: { email: signInInput.email },
      include: { role: true }
    });

    if (user && (await bcrypt.compare(signInInput.password, user.password))) {

      const jwt_sign = { username: user.name, sub: user.id, role: user.role.type };

      const token = await this._jwtService.sign(jwt_sign);


      try {
        await jwt.verify(user.refreshToken, process.env.JWT_KEY)
      } catch (err) {
        const refreshToken = jwt.sign(jwt_sign, process.env.JWT_KEY, { expiresIn: "60s" })


        await this._prismaService.user.update({
          where: { id: user.id },
          data: { token, refreshToken },
        });

        return { ...user, token: token, refreshToken } as User;
      };

      if (token) {

        await this._prismaService.user.update({
          where: { id: user.id },
          data: { token: token },
        });

        return { ...user, token: token } as User;
      } else {

        throw new HttpException(`Generate token error`, HttpStatus.BAD_REQUEST);
      }
    }

    throw new HttpException(`Wrong email or password`, HttpStatus.BAD_REQUEST);
  }

  async updateUser(
    id: number,
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    if (updateUserInput.password) {
      updateUserInput.password = await bcrypt.hash(
        updateUserInput.password,
        10,
      );
    }
    const user = await this._prismaService.user.update({
      where: { id },
      data: updateUserInput,
      include: { role: true }
    });
    return user as User;
  }
}
