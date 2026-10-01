import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Coins - The Cartel",
    description: "Access your admin portal",
};


export default function CoinsLayour({
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
