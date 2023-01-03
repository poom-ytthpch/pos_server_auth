
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class SignUpInput {
    email: string;
    name: string;
    password: string;
    roleId: number;
}

export class SignInInput {
    email: string;
    password: string;
}

export class UpdateUserInput {
    id: number;
    email?: Nullable<string>;
    name?: Nullable<string>;
    password?: Nullable<string>;
}

export class CreateRoleInput {
    type: string;
}

export class User {
    id: number;
    email: string;
    name: string;
    password?: Nullable<string>;
    token: string;
    refreshToken: string;
    role: Role;
}

export class Role {
    id: number;
    type: string;
}

export abstract class IQuery {
    abstract users(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract user(email: string): User | Promise<User>;
}

export abstract class IMutation {
    abstract createRole(createRoleInput: CreateRoleInput): Role | Promise<Role>;

    abstract signUp(signUpInput: SignUpInput): User | Promise<User>;

    abstract signIn(signInInput: SignInInput): User | Promise<User>;

    abstract updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;
}

type Nullable<T> = T | null;
