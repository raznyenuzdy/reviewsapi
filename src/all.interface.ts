import { IsNotEmpty } from "class-validator";

interface AuthData {
    user_id: number,
    email: string,
    email_verified: boolean,
    name: string,
    nickname: string,
    picture: string,
    created_at: string,
    updated_at: string,
    last_password_reset: string,
    last_ip: string,
    last_login: string,
    logins_count: number
}

export interface IPayLoad {
    iss: string,
    sub: string,
    aud: [string],
    iat: number,
    exp: number,
    azp: string,
    scope: string
}

export interface IBlockCreationAttributes extends IBlockAdminAttributes{
    id: number;
    ref_user: number;
    user_model: string;
    ref_page: number;
    type: string;
    label: string;
    text: string;
}

export interface IBlockAdminAttributes {
    approved: boolean;
    closed: boolean;
    deleted: boolean;
}

export class BlockAdminAttributes implements IBlockAdminAttributes {
    @IsNotEmpty() approved: boolean;
    @IsNotEmpty() closed: boolean;
    @IsNotEmpty() deleted: boolean;
}

export interface IUserCreationAttributes {
    user_id: string,
    email: string,
    email_verified: boolean,
    name: string,
    nickname: string,
    picture: string,
    created_at: string,
    updated_at: string,
    last_password_reset: string,
    last_ip: string,
    last_login: string,
    logins_count: number
    md5: string,

    id: number;
    // user_id: string;
    // email: string;
    // email_verified: boolean;
    // name: string;
    // nickname: string;
    // picture: string;
    role?: string;
}
