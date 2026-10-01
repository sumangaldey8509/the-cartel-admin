"use client"

import { Shield, Lock, ArrowLeft, Home, Mail } from "lucide-react"
import { useRouter } from "next/navigation"

interface PermissionDeniedProps {
    title?: string
    message?: string
    showContactAdmin?: boolean
    showGoBackButton?: boolean
    showHomeButton?: boolean
    className?: string
}

const PermissionDenied = ({
    title = "Access Denied",
    message = "You do not have permission to access this page. Contact your administrator for more information.",
    showContactAdmin = true,
    showGoBackButton = true,
    showHomeButton = true,
    className = ""
}: PermissionDeniedProps) => {
    const router = useRouter()

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] ${className}`}>
            <div className="w-full max-w-md text-center">
                {/* Icon */}
                <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#bf953f]/10 to-[#d4af37]/10 border border-[#bf953f]/30 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#bf953f]/20 to-[#d4af37]/20 flex items-center justify-center">
                            <Shield className="w-12 h-12 text-[#bf953f]" />
                        </div>
                    </div>
                    <div className="absolute inset-0 mx-auto w-32 h-32 rounded-full border-2 border-transparent border-t-[#bf953f]/20 animate-spin-slow" />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-white mb-3">
                    {title}
                </h1>

                {/* Message */}
                <p className="text-[#888] mb-8 leading-relaxed">
                    {message}
                </p>

                {/* Contact Info */}
                {showContactAdmin && (
                    <div className="mb-8 p-4 bg-[#1a1a1a] border border-[#333] rounded-lg">
                        <p className="text-sm text-[#666] mb-2">
                            Please contact your system administrator:
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {showGoBackButton && (
                        <button
                            onClick={() => router.back()}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1a1a] border border-[#333] text-[#C0C0C0] rounded-lg hover:bg-[#222] hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </button>
                    )}

                    {showHomeButton && (
                        <button
                            onClick={() => router.push("/")}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#bf953f] to-[#d4af37] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <Home className="w-4 h-4" />
                            Go to Home
                        </button>
                    )}
                </div>

                {/* Footer Note */}
                <div className="mt-8 pt-6 border-t border-[#333]">
                    <p className="text-xs text-[#666]">
                        If you believe this is an error, please provide your user ID and page URL to support.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PermissionDenied