// import { Field, ObjectType } from '@nestjs/graphql' 
import { Field, ObjectType } from "type-graphql"

import { Role } from './role'

@ObjectType()
export class User {
    @Field()
    id: number

    @Field()
    email: string

    @Field()
    name: string

    @Field()
    password: string

    @Field()
    token: string

    @Field()
    refreshToken: string

    @Field()
    role: Role
}