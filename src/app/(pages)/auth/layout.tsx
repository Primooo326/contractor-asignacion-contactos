import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main data-theme="dark">
            {children}
            <ToastContainer />
        </main>
    );
}