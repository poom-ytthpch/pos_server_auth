import { Resolver, Query, Mutation, Arg, Int, Authorized } from "type-graphql"
import { Role, CreateRoleInput } from "../types"
import { RoleService } from "../services/role.service"

@Resolver(() => Role)
export class RoleResolver {
    constructor(
        private readonly roleService: RoleService
    ) { }

    @Query(() => [Role], { name: "roles" })
    getAllRole() {
        return this.roleService.getAllRole()
    }

    @Mutation(() => Role, { name: "createRole" })
    createRole(@Arg('createRoleInput') createRoleInput: CreateRoleInput) {
        return this.roleService.createRole(createRoleInput)
    }
}