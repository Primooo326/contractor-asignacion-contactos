import type React from 'react'
import { useEffect } from 'react'
import "./styles.scss"
export interface ModalProps {
    children: React.ReactNode;
    id: string;
    className?: string;
    isOpen: boolean;
    canCloseEsc?: boolean;
    canCloseOut?: boolean;
    onClose: () => void;
}

export default function Modal({
    children,
    id,
    className,
    isOpen,
    canCloseEsc = true,
    canCloseOut = true,
    onClose,
}: ModalProps) {
    const handleKeyDown = (e: any) => {
        if (e.keyCode === 27 && canCloseEsc) {
            onClose();
        }
    };

    const handleClickOut = (e: any) => {
        if ((e.target as HTMLElement).id === id && canCloseOut) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    useEffect(() => { }, [children]);

    return (
        <>
            {isOpen && (
                <section id={id} className="modale" onClick={handleClickOut}>
                    <div className={`modal-content bg-base-200 ${className} `}>{children}</div>
                </section>
            )}
        </>
    );
}
