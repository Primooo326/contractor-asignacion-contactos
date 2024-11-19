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
    is_admin: 1 | 0;
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
