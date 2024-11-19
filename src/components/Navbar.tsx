import React from 'react'
import { DynamicIcon } from './DynamicIcon'
import Cookies from "js-cookie";
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const [isOnHomePage, setIsOnHomePage] = React.useState(pathname === '/');

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

    React.useEffect(() => {
        if (pathname === '/home') {
            setIsOnHomePage(true);
        } else {
            setIsOnHomePage(false);
        }
    }, [pathname]);

    return (
        <div className="navbar border-b p-4">
            <div className="navbar-start">

                <img src="/logoBlack.svg" alt="contractor" style={{ width: '280px' }} />

            </div>

            <div className="navbar-center">

                {
                    isOnHomePage ? <button className="btn btn-primary" onClick={handleUsers}>Usuarios <DynamicIcon icon="mi:user" /></button> :
                        <button className="btn btn-primary" onClick={handleHome} >Home <DynamicIcon icon="mi:home" /></button>
                }
            </div>

            <div className="navbar-end">
                <button className="btn btn-error" onClick={handleLogout} >Cerrar sesión <DynamicIcon icon="mi:log-out" /></button>
            </div>
        </div>
    )
}
