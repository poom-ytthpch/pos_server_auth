import { Field, ObjectType } from "type-graphql"
import { User } from "./user"

@ObjectType()
export class UserCredential {

    @Field()
    status: boolean

    @Field({ nullable: true })
    message?: string

    @Field({ nullable: true })
    user?: User

    @Field({ nullable: true })
    canRetryVerify?: number;
}