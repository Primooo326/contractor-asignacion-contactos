"use client"
import Cookies from "js-cookie";

import React, { useEffect } from 'react';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/Navbar';
import { useSystemStore } from '@hooks/system.hook';
import { verifyJWT } from '@utils/tools';
import "./MainLayout.scss";
interface LayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {

    const { setIsAdmin } = useSystemStore();

    const verifySession = async () => {
        const token = Cookies.get('token');
        const data: any = await verifyJWT(token!);
        if (data) {
            if (data.isAdmin === 1) {
                setIsAdmin(true);
            }
        }
    };

    useEffect(() => {

        verifySession();
    }, []);

    return (

        <main className={`mainLayout`} data-theme="dark">
            <Navbar />
            {children}
            <ToastContainer />
        </main>
    );
}
