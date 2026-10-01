import Heading from "@/components/common/heading/heading"
import WalletConnectionsDashboard from "@/components/dashboard/walletConnection/walletConnection"
import { ProtectedRoute } from "@/components/common/ProtectedRoute"

const Dashboard = () => {
    return (
        <ProtectedRoute module="dashboard" action="read">
            <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a] p-4">
                <div className="mx-auto" >
                    <Heading
                        heading="Dashboard"
                        subHeading="Your community insights at a glance"
                    />
                </div>
                <WalletConnectionsDashboard />
            </div>
        </ProtectedRoute>
    )
}

export default Dashboard