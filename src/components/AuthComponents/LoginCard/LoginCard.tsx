import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";
import { verifyJWT } from "@/utils/tools";
import { DynamicIcon } from "@/components/DynamicIcon";
import { toast } from "react-toastify";
import { login } from "@/api/auth.api";
import 'react-toastify/dist/ReactToastify.css';

export default function LoginCard({ setCargando, setReset }: { setCargando: (b: boolean) => void, setReset: (b: boolean) => void }) {
    const router = useRouter();
    const [userForm, setUserForm] = useState("");
    const [password, setPassword] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const handleUsuarioChange = (event: any) => {
        setUserForm(event.target.value);
    };

    const handlePasswordChange = (event: any) => {
        setPassword(event.target.value);
    };

    const isEmailValid = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isFormValid = isEmailValid(userForm) && password.length >= 5;

    const onClickLogin = async (e: any) => {
        e.preventDefault();
        if (!isFormValid) {
            toast.error("Por favor, ingresa un correo válido y una contraseña de al menos 5 caracteres.");
            return;
        }

        setCargando(true);
        try {
            const res = await login(userForm, password);
            if (!res.token) {
                toast.error(res.message);
                setCargando(false);
                return;
            }
            Cookies.set("token", res.token);
            if (res.resetPass) {
                setReset(true);
            } else {
                router.push("/home")
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        }
        setCargando(false);
    };

    const MostrarPass = () => {
        setMostrarPassword(!mostrarPassword);
    };

    const verifyToken = async (token: string) => {
        const data = await verifyJWT(token);
        if (data !== false) {
            setCargando(false);
            router.push("/home");
        }
    };

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            verifyToken(token);
        }
        setCargando(false);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen px-4">
            <div className="bg-base-200 rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-center mb-4">
                    <Image src="/logoBlack.svg" width={300} height={50} alt="Logo" />
                </div>
                <h1 className="text-center text-xl mb-6 mt-5">Inicio de Sesión</h1>
                <form>
                    <div className="flex items-center  rounded-lg py-2 px-3 mb-4">
                        <DynamicIcon icon='fa-solid:users' className='text-lg  mr-3' />
                        <input
                            onChange={handleUsuarioChange}
                            type="text"
                            placeholder="Correo"
                            className="input input-bordered outline-none grow"
                            value={userForm}
                        />
                    </div>
                    <div className="flex items-center  rounded-lg py-2 px-3 mb-4">
                        <DynamicIcon icon='mingcute:lock-fill' className='text-lg mr-3' />
                        <input
                            onChange={handlePasswordChange}
                            type={mostrarPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            className="input input-bordered outline-none grow"
                            value={password}
                        />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="flex items-center text-sm">
                            <input type="checkbox" onChange={MostrarPass} className="mr-2" />
                            Mostrar contraseña
                        </label>
                    </div>
                    <button
                        onClick={onClickLogin}
                        disabled={!isFormValid}
                        className={` bg-base-100 w-full py-2 rounded-lg shadow-lg transition-colors ${!isFormValid ? " cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 "
                            }`}
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
}
