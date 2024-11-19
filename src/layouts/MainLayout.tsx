"use client"

import React from 'react';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
    return (

        <main className={`mainLayout`} data-theme="light">
            <Navbar />
            {children}
            <ToastContainer />
        </main>
    );
}
