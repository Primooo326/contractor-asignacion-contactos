"use client"

import React from 'react';
// import './MainLayout.scss';
import { usePathname } from 'next/navigation';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
    const pathname = usePathname();
    const showSecondDrawer = pathname === '/home';

    return (
        <main className={`mainLayout`} data-theme="light">
            <Navbar />
            {children}
            <ToastContainer />
        </main>
    );
}
