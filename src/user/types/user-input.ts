// import { Field, InputType } from '@nestjs/graphql'
import { Field, InputType } from "type-graphql"

import { User } from './user'
@InputType()
export class SignUpInput {

    @Field()
    email: string

    @Field()
    name: string

    @Field()
    password: string

    @Field()
    roleId: number
}

@InputType()
export class SignInInput {
    @Field()
    email: string

    @Field()
    password: string
}