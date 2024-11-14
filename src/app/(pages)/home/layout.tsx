import MainLayout from "@layouts/MainLayout"
import "./styles.scss"
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
        </MainLayout>
    )
}
