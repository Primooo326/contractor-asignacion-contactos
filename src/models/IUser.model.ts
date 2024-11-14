import { IResponseApiOne } from "./IResponseApi.model";

export interface IUserRequestBody {
    status: boolean;
}

export interface IUser {
    id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    email: string;
    status: boolean;
    is_admin: boolean;
    createdAt: number;
    messages_minute: number;
}

export interface IBodyLogin {
    message: string;
    resetPass: boolean;
    token: string;
    user: IUser;
}

export interface IBodyResetPass {
    message?: string;
    error?: string;
    statusCode: number;
}

export type TUserLoginResponse = IResponseApiOne<IBodyLogin> | IBodyLogin
