import { IParamsRequest, IResponseApi } from "@/models/IResponseApi.model";
import { fetchApiBase } from "./instances";
import { ILog } from "@models/ILog.model";

export async function getLogs(params?: IParamsRequest): Promise<IResponseApi<ILog>> {
    return fetchApiBase.get(`/assignment`, params);
}