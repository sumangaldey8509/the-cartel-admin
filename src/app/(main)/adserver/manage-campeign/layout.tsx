import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mange Campeign - The Cartel",
    description: "Access your admin portal",
};


export default function ManageCampeignLayour({
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
