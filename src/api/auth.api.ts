import { IBodyLogin, IBodyResetPass } from "@/models/IUser.model";
import { fetchApiBase } from "./instances";


export async function login(email: string, password: string): Promise<IBodyLogin> {
    try {
        const response = await fetchApiBase.post(`/auth/login`, { email, password });
        return response; 
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message); 
        } else {
            throw new Error("Error desconocido al iniciar sesión."); 
        }
    }
}

export async function changePassword(newPassword: string, repeatPassword: string): Promise<IBodyResetPass> {
    return fetchApiBase.post(`/user/changePassword`, { newPassword, repeatPassword });
}