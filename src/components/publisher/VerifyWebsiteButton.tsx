import { Shield, RefreshCw, Check, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import appClient from '@/lib/appClient'
import { useAppSelector } from '@/store/hooks/hooks'
// import toast from 'react-hot-toast'

interface VerifyWebsiteButtonProps {
    publisherId: string
    website: string
    verificationToken: string
    userId: string
    onVerificationComplete?: (success: boolean, message?: string) => void
    authedUserEmail?: string
    className?: string
}

const VerifyWebsiteButton = ({
    publisherId,
    website,
    verificationToken,
    userId,
    onVerificationComplete,
    authedUserEmail,
    className = ''
}: VerifyWebsiteButtonProps) => {
    const [isVerifying, setIsVerifying] = useState(false)
    const [verificationResult, setVerificationResult] = useState<{
        success: boolean
        message?: string
    } | null>(null)


    const handleVerifyWebsite = async () => {
        if (!website || website === "Not provided" || !verificationToken) {
            // toast.error(website === "Not provided" ? "No website provided" : "No verification token found")
            return
        }

        setIsVerifying(true)
        setVerificationResult(null)

        try {
            const payload = {
                userId: userId,
                website: website
            }

            const response = await appClient.post(`/api/publisher/meta-verification`, payload)

            if (response.data.status) {
                const successMessage = response.data.message || 'Website verified successfully!'
                setVerificationResult({
                    success: response.data.status,
                    message: successMessage
                })
                // toast.success(successMessage)

                if (onVerificationComplete) {
                    onVerificationComplete(true, successMessage)
                }
            } else {
                throw new Error(response.data.message || 'Verification failed')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Verification failed. Please try again."
            setVerificationResult({
                success: false,
                message: errorMessage
            })
            // toast.error(errorMessage)

            if (onVerificationComplete) {
                onVerificationComplete(false, errorMessage)
            }
        } finally {
            setIsVerifying(false)
        }
    }

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Shield size={16} className="text-[#bf953f]" />
                    <span className="text-sm font-medium text-white">Website Verification</span>
                </div>
                {website && website !== "Not provided" && (
                    <button
                        type="button"
                        onClick={() => window.open(website, '_blank')}
                        className="text-xs text-gray-400 hover:text-white flex items-center space-x-1"
                    >
                        <ExternalLink size={12} />
                        <span>Visit</span>
                    </button>
                )}
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333] space-y-3">
                <div className="space-y-2">
                    <div className="text-gray-400 text-xs">Verification Token</div>
                    <div className="font-mono text-sm text-white bg-[#2a2a2a] px-3 py-2 rounded border border-[#333] break-all">
                        {verificationToken || "No token generated"}
                    </div>
                </div>

                <div className="text-gray-400 text-xs space-y-1">
                    <div className="font-semibold">To verify ownership:</div>
                    <ol className="list-decimal list-inside space-y-1 pl-1">
                        <li>Publisher must add the meta tag to their website</li>
                        <li>Click "Verify Now" to check if meta tag is present</li>
                        <li>Status will auto-update to "Verified" if successful</li>
                    </ol>
                </div>

                <button
                    type="button"
                    onClick={handleVerifyWebsite}
                    disabled={isVerifying || !verificationToken || website === "Not provided"}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#bf953f] to-[#d4af37] hover:from-[#d4af37] hover:to-[#e6c064] disabled:from-[#bf953f]/50 disabled:to-[#d4af37]/50 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-all duration-200 text-sm"
                >
                    {isVerifying ? (
                        <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Verifying...</span>
                        </>
                    ) : (
                        <>
                            <Shield size={14} />
                            <span>Verify Website Now</span>
                        </>
                    )}
                </button>

                {verificationResult && (
                    <div className={`p-3 rounded-lg border text-sm ${verificationResult.success ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                        <div className="flex items-start space-x-2">
                            {verificationResult.success ? (
                                <Check size={16} className="mt-0.5" />
                            ) : (
                                <div className="w-4 h-4 flex items-center justify-center mt-0.5">✗</div>
                            )}
                            <div>
                                <div className="font-medium">
                                    {verificationResult.success ? 'Verification Successful!' : 'Verification Failed'}
                                </div>
                                <div className="text-xs opacity-90 mt-0.5">
                                    {verificationResult.message}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VerifyWebsiteButton