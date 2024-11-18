import { IParamsRequest, IResponseApi } from "@/models/IResponseApi.model";
import { fetchApiBase } from "./instances";
import { IUser } from "@models/IUser.model";

export async function getUsers(params?: IParamsRequest): Promise<IResponseApi<IUser>> {
    return fetchApiBase.get(`/leads/users`, params);
}

export const createUser = async (data: any) => {
    return await fetchApiBase.post("leads/users", data);
};

export const updateUser = async (id: string | number, data: any) => {
    return await fetchApiBase.put(`leads/users/${id}`, data);
};

export const deleteUser = async (id: string | number) => {
    return await fetchApiBase.delete(`leads/users/${id}`);
};