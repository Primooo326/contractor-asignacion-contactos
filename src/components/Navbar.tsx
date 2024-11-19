import { DynamicIcon } from './DynamicIcon'
import Cookies from "js-cookie";
import { usePathname, useRouter } from 'next/navigation';
import { useSystemStore } from '@hooks/system.hook';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { isAdmin } = useSystemStore();
    const [isOnHomePage, setIsOnHomePage] = useState(pathname === '/');

    const handleLogout = () => {
        console.log('logout')
        Cookies.remove('token')
        router.push('/')
    }

    const handleUsers = () => {
        console.log('users')
        router.push('/users')
    }

    const handleHome = () => {
        console.log('home')
        router.push('/home')
    }

    const handleLogs = () => {
        console.log('logs')
        router.push('/logs')
    }

    useEffect(() => {
        if (pathname === '/home') {
            setIsOnHomePage(true);
        } else {
            setIsOnHomePage(false);
        }
    }, [pathname]);

    useEffect(() => {
        console.log(isAdmin);
    }, [isAdmin]);

    return (
        <div className="navbar border-b p-4">
            <div className="navbar-start">

                <img src="/logoBlack.svg" alt="contractor" style={{ width: '280px' }} />

            </div>

            <div className="navbar-center flex gap-5">

                {
                    isAdmin && (
                        <>

                            <button className="btn btn-primary" disabled={pathname === '/home'} onClick={handleHome}> <DynamicIcon icon="mi:home" className="size-6" /> Home</button>
                            <button className="btn btn-primary" disabled={pathname === '/users'} onClick={handleUsers}> <DynamicIcon icon="mi:user" className="size-6" /> Usuarios</button>
                            <button className="btn btn-primary" disabled={pathname === '/logs'} onClick={handleLogs}> <DynamicIcon icon="mingcute:paper-line" className="size-6" />Logs</button>

                        </>
                    )
                }

            </div>

            <div className="navbar-end">
                <button className="btn btn-error" onClick={handleLogout} >Cerrar sesión <DynamicIcon icon="mi:log-out" /></button>
            </div>
        </div>
    )
}
