import { Role, CreateRoleInput } from "../types";
import { PrismaService } from "src/common/prisma/prisma.service";
import to from "await-to-js"
import { CACHE_MANAGER, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { Cache } from 'cache-manager';

export class RoleService {
    constructor(
        private readonly repos: PrismaService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) { }

    async createRole(createRoleInput: CreateRoleInput): Promise<Role> {
        const { type } = createRoleInput

        if (await this.repos.role.findFirst({ where: { type } })) throw new HttpException(`Role already exist.`, HttpStatus.BAD_REQUEST,);

        const [err, res] = await to(this.repos.role.create({ data: createRoleInput }))

        if (err) throw new HttpException(`Error:${err}.`, HttpStatus.BAD_REQUEST,);

        return res as Role
    }

    async getAllRole(): Promise<Role[]> {

        const [err, res] = await to(this.repos.role.findMany())

        if (err) throw new HttpException(`Error:${err}.`, HttpStatus.BAD_REQUEST,);

        return res as Role[]
    }
}