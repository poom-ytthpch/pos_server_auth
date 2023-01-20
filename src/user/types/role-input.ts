import { Field, InputType } from "type-graphql"

@InputType()
export class CreateRoleInput {

    @Field()
    type: string

}