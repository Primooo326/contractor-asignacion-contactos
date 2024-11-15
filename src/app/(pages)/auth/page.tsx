"use client"
import { useState } from "react";
import { motion } from 'framer-motion';
import ResetCard from "@/components/AuthComponents/ResetCard/ResetCard";
import LoginCard from "@/components/AuthComponents/LoginCard/LoginCard";

export default function page() {
    const [cargando, setCargando] = useState(false);
    const [reset, setReset] = useState(false)
    return (
        <>
            {reset ? (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ type: 'linear', stiffness: 200 }}
                    exit={{ y: "100%" }}
                >
                    <ResetCard setCargando={setCargando} />
                </motion.div>

            ) : (
                <LoginCard setCargando={setCargando} setReset={setReset} />
            )}
        </>
    )
}
