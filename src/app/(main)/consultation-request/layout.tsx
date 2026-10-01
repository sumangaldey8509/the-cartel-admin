import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Consultation Request - The Cartel",
    description: "Access your admin portal",
};


export default function ConsultationLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex h-screen overflow-hidden">
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
