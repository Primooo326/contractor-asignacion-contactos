import { API_BASE_URL, API_CONTRACTOR_URL, CONTRACTOR_KEY } from "@/config";
import axios, { type AxiosResponse, type ResponseType } from 'axios';
import { toast } from "react-toastify";
import Cookies from "js-cookie"
import { IParamsRequest } from "@/models/IResponseApi.model";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

            } else if (Number(error.response.status) === 429) {
                console.log(error);
            }
            else if (error.code === 'ERR_NETWORK') {
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

const responseBody = (response: AxiosResponse) => response ? response.data : response;

const handleRequest = async (
    requestFn: () => Promise<any>,
    maxRetries: number = 3
) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await requestFn();
        } catch (error: any) {
            if (error.response?.status === 429) {
                const retryAfter = parseInt(error.response.headers['x-ratelimit-interval-milliseconds']) || 5000;
                // const mensaje = `Intento ${attempt}/${maxRetries}: Rate limit alcanzado. Esperando ${retryAfter}ms antes de reintentar...`
                const mensaje = `Espere ${retryAfter / 1000} segundos, se intentara de nuevo automáticamente.`
                toast.error(mensaje)
                console.log(mensaje);
                if (attempt < maxRetries) {
                    await delay(retryAfter);
                    continue;
                }

            } else {

                throw error;
            }
        }
    }
};

export const fetchApiContractor = {
    get: (url: string, responseType?: ResponseType, maxRetries?: number) =>
        handleRequest(
            () => instance("contractor")
                .get(url, { responseType })
                .then(responseBody),
            maxRetries
        ),

    post: (url: string, body?: any, headers?: any, maxRetries?: number) =>
        handleRequest(
            () => instance("contractor", headers)
                .post(url, body)
                .then(responseBody),
            maxRetries
        ),

    put: (url: string, body?: any, maxRetries?: number) =>
        handleRequest(
            () => instance("contractor")
                .put(url, body)
                .then(responseBody),
            maxRetries
        ),

    patch: (url: string, body?: any, maxRetries?: number) =>
        handleRequest(
            () => instance("contractor")
                .patch(url, body)
                .then(responseBody),
            maxRetries
        ),

    delete: (url: string, maxRetries?: number) =>
        handleRequest(
            () => instance("contractor")
                .delete(url)
                .then(responseBody),
            maxRetries
        ),

    downloadFile: (url: string, body: any, _instance: "contractor" = "contractor", maxRetries?: number) =>
        handleRequest(
            () => instance(_instance)
                .post(url, body, { responseType: 'blob' })
                .then(responseBody),
            maxRetries
        ),

    downloadFileGet: (url: string, _instance: "contractor" = "contractor", maxRetries?: number) =>
        handleRequest(
            () => instance(_instance)
                .get(url, { responseType: 'blob' })
                .then(responseBody),
            maxRetries
        ),
};

export const fetchApiBase = {
    get: (url: string, params?: IParamsRequest, responseType?: ResponseType, maxRetries?: number) =>
        handleRequest(
            () => instance("base")
                .get(url, { params, responseType })
                .then(responseBody),
            maxRetries
        ),

    post: (url: string, body?: any, maxRetries?: number) =>
        handleRequest(
            () => instance("base")
                .post(url, body)
                .then(responseBody),
            maxRetries
        ),

    put: (url: string, body?: any, maxRetries?: number) =>
        handleRequest(
            () => instance("base")
                .patch(url, body)
                .then(responseBody),
            maxRetries
        ),

    patch: (url: string, body?: any, maxRetries?: number) =>
        handleRequest(
            () => instance("base")
                .patch(url, body)
                .then(responseBody),
            maxRetries
        ),

    delete: (url: string, maxRetries?: number) =>
        handleRequest(
            () => instance("base")
                .delete(url)
                .then(responseBody),
            maxRetries
        ),
};