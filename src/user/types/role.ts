// import { Field, ObjectType } from '@nestjs/graphql'
import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class Role {
    @Field()
    id: number

    @Field()
    type: string
}