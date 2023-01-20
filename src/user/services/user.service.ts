import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { User, SignUpInput, SignInInput, UserCredential } from '../types';
import to from "await-to-js"
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken"
import { user } from 'src/types/grpc/user';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { JwtService } from '@nestjs/jwt';

export class UserService {

  constructor(
    private readonly repos: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly jwtService: JwtService
  ) { }

  create(createUserInput) {
    return 'This action adds a new user';
  }

  @GrpcMethod("UserService", 'FindOne')
  async userGrpc(data: user.UserByEmail, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<user.User> {

    const { email } = data

    const res = await this.repos.user.findFirst({ where: { email: email }, include: { role: true } });

    if (!res) return null

    return res;
  }

  async findAll(): Promise<User[]> {

    const [errSG, resGet] = await to(this.cacheManager.get(`users`))

    if (resGet) return resGet as User[]

    const [err, res] = await to(this.repos.user.findMany({ include: { role: true } }))

    const [errSet, resSet] = await to(this.cacheManager.set(`users`, res))

    return res as User[];
  }

  async findOne(id: number): Promise<User> {
    const [err, res] = await to(this.repos.user.findFirst({ where: { id }, include: { role: true } }))
    return res as User;
  }

  async signUp(signUpInput: SignUpInput): Promise<User> {

    const { email } = signUpInput

    const { exist, id } = await this.isUserExist({ email })

    if (exist) {
      throw new HttpException(
        `User already exist. UserId:${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const pass = await bcrypt.hash(signUpInput.password, 10);

    signUpInput.password = pass;

    const user_create = await this.repos.user.create({ data: signUpInput, include: { role: true } });

    return user_create as User;
  }

  async signIn(signInInput: SignInInput): Promise<UserCredential> {

    const { email } = signInInput

    if (!(signInInput.email && signInInput.password)) throw new HttpException(`All input is required`, HttpStatus.BAD_REQUEST);

    const { exist, id, name, password, refreshToken, role } = await this.isUserExist({ email })

    if (exist && (await bcrypt.compare(signInInput.password, password))) {

      const jwt_sign = { username: name, sub: id, role: role.type };

      const token = await this.jwtService.sign(jwt_sign);


      try {

        await jwt.verify(refreshToken, process.env.JWT_KEY)

      } catch (err) {

        const refreshToken = jwt.sign(jwt_sign, process.env.JWT_KEY, { expiresIn: "60s" })

        await this.repos.user.update({
          where: { id },
          data: { token, refreshToken },
        });

        return { status: true, message: "success", user: { id, email, name, password, token, refreshToken, role }, canRetryVerify: 3 } as UserCredential;
      };

      if (token) {

        await this.repos.user.update({
          where: { id },
          data: { token },
        });

        return { status: true, message: "success", user: { id, email, name, password, refreshToken, token: token, role }, canRetryVerify: 3 } as UserCredential;
      } else {

        throw new HttpException(`Generate token error`, HttpStatus.BAD_REQUEST);
      }
    }

    return { status: false, message: "Wrong Username or Password", canRetryVerify: 2 }
  }

  update(id: number, updateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }


  private async isUserExist(req: any) {

    const { email } = req

    const [err, res] = await to(this.repos.user.findUnique({ where: { email: email }, select: { id: true, email: true, name: true, password: true, token: true, refreshToken: true, role: true } }))

    return { exist: Boolean(res), ...res }

  }
}
