import { API_BASE_URL, API_CONTRACTOR_URL, CONTRACTOR_KEY } from "@/config";
import axios, { type AxiosResponse, type ResponseType } from 'axios';
import { toast } from "react-toastify";
import Cookies from "js-cookie"
import { IParamsRequest } from "@/models/IResponseApi.model";

const instance = (api: "contractor" | "base", headers?: any) => {
    let baseURL: string = 'contractor';
    if (api === 'contractor') {
        baseURL = API_CONTRACTOR_URL;
    } else if (api === 'base') {
        baseURL = API_BASE_URL;
    } else {
        baseURL = API_BASE_URL;
    }

    const instancia = axios.create({
        baseURL,
        headers: headers ?? {
            "Content-Type": "application/json",
            "version": "2021-07-28",
        },
    });

    instancia.interceptors.request.use(
        (config) => {
            let tokenContractor = CONTRACTOR_KEY;
            let token = ""
            if (Cookies.get('token')) {
                token = String(Cookies.get('token'));
            }
            if (api == 'contractor') {
                config.headers.Authorization = tokenContractor ? `Bearer ${tokenContractor}` : null;
            } else if (token) {
                config.headers.Authorization = token ? `Bearer ${token}` : null;
            }
            return config;
        },
        (error) => {
            console.error(error);
            return Promise.reject(error);
        }
    );

    instancia.interceptors.response.use(
        (response) => response,
        (error) => {
            console.error("error response::::", error);
            if (error.response && Number(error.response.status) === 401) {
            } else if (error.code === 'ERR_NETWORK') {
                toast.error('Error de red, verifique su conexión a internet.');
            } else if (error.response.data.message) {

                toast.error(error.response.data.message);
            }
            else {
                console.error(error);
                toast.error('Error inesperado, por favor intente nuevamente.');
            }
            return Promise.reject(error);
        }
    );

    return instancia;
}

const responseBody = (response: AxiosResponse) =>
    response ? response.data : response;

export const fetchApiContractor = {
    get: (url: string, responseType?: ResponseType) =>
        instance("contractor")
            .get(url, {
                responseType,
            })
            .then(responseBody),
    post: (url: string, body?: any, headers?: any) =>
        instance("contractor", headers).post(url, body).then(responseBody),
    put: (url: string, body?: any) => instance("contractor").put(url, body).then(responseBody),
    patch: (url: string, body?: any) =>
        instance("contractor").patch(url, body).then(responseBody),
    delete: (url: string) => instance("contractor").delete(url).then(responseBody),
    downloadFile: (url: string, body: any, _instance: "contractor" = "contractor") => instance(_instance).post(url, body, { responseType: 'blob' }).then(responseBody),
    downloadFileGet: (url: string, _instance: "contractor" = "contractor") => instance(_instance).get(url, { responseType: 'blob' }).then(responseBody),
};

export const fetchApiBase = {
    get: (url: string, params?: IParamsRequest, responseType?: ResponseType) =>
        instance("base")
            .get(url, {
                params,
                responseType,
            })
            .then(responseBody),
    post: (url: string, body?: any) =>
        instance("base").post(url, body).then(responseBody),
    put: (url: string, body?: any) => instance("base").patch(url, body).then(responseBody),
    patch: (url: string, body?: any) =>
        instance("base").patch(url, body).then(responseBody),
    delete: (url: string) => instance("base").delete(url).then(responseBody),
};