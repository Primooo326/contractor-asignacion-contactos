import MainLayout from "@/layouts/MainLayout"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
    title: 'Contractor',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <MainLayout>
            {children}
            <ToastContainer />
        </MainLayout>
    )
}
