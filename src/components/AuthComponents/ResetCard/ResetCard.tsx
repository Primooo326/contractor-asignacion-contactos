import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./ResetCard.css";
import { changePassword } from "@/api/auth.api";
import Cookies from "js-cookie";

export default function ResetCard({ setCargando }: { setCargando: (b: boolean) => void }) {
    const router = useRouter();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const handleNewPasswordChange = (event: any) => {
        setNewPassword(event.target.value);
    };

    const handlePasswordChange = (event: any) => {
        setConfirmPassword(event.target.value);
    };

    const isFormValid = newPassword.length >= 5 && confirmPassword.length >= 5 && newPassword === confirmPassword;

    const onClickReset = async (e: any) => {
        e.preventDefault();
        if (!isFormValid) {
            toast.error("Las contraseñas deben tener al menos 5 caracteres y coincidir.");
            return;
        }
        setCargando(true);
        try {
            const res = await changePassword(newPassword, confirmPassword);
            if (res.statusCode === 200) {
                toast.success("Contraseña cambiada exitosamente.", { autoClose: 5000 });
                router.push("/home");
            } else {
                Cookies.remove("token");
                router.push("/");
            }
        } catch (error: any) {
            console.error(error);
        }
        setCargando(false);
    };

    const MostrarPass = () => {
        setMostrarPassword(!mostrarPassword);
    };

    useEffect(() => {
        toast.info("Por favor cambia tu contraseña", { autoClose: 5000 });
        setCargando(false);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen px-4 ">
            <div className=" rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-center mb-4">
                    <Image src="/logoBlack.svg" width={300} height={50} alt="Logo" />
                </div>
                <h1 className="text-center text-xl mb-6 mt-5">Cambia de contraseña</h1>
                <form>
                    <label className="input flex items-center  rounded-lg py-2 px-3 mb-4">
                        <svg role="img" aria-label="x" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4  mr-3">
                            <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                        </svg>
                        <input onChange={handleNewPasswordChange} type={mostrarPassword ? "text" : "password"} className=" outline-none grow" placeholder="Contraseña nueva" />
                    </label>
                    <label className="input flex items-center  rounded-lg py-2 px-3 mb-4">
                        <svg role="img" aria-label="x" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4  mr-3">
                            <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                        </svg>
                        <input onChange={handlePasswordChange} type={mostrarPassword ? "text" : "password"} className=" outline-none grow" placeholder="Repite contraseña" />
                    </label>
                    <div className="flex items-center justify-between mb-4">
                        <label className="flex items-center text-sm">
                            <input type="checkbox" onChange={MostrarPass} className="mr-2" />
                            Mostrar contraseñas
                        </label>
                    </div>
                    <button
                        onClick={onClickReset}
                        disabled={!isFormValid}
                        className={`w-full py-2 rounded-lg shadow-lg transition-colors mt-5 ${isFormValid ? "bg-indigo-600 hover:bg-indigo-500" : " cursor-not-allowed"}`}
                    >
                        Actualizar contraseña
                    </button>
                </form>
            </div>
        </div>
    );
}
