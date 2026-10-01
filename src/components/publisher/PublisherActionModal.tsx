"use client"

import { PublihserInterface } from "@/interface/publishers"
import appClient from "@/lib/appClient"
import { useAppSelector } from "@/store/hooks/hooks"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, CheckCircle, AlertCircle, PauseCircle, Clock,
    Globe, Building, User, Mail, Phone, MessageCircle,
    Link as LinkIcon, FileText, Shield, Zap, ExternalLink,
    Trash2, Send, Edit, Eye, Copy, Check, RefreshCw
} from "lucide-react"
import { useState } from "react"

interface PublisherActionModalProps {
    isOpen: boolean
    onClose: () => void
    publisher: PublihserInterface | null
    onStatusChange: (id: string, status: 'pending' | 'verified' | 'rejected' | 'hold' | 'pause', actionNote?: string) => void
    onDelete: (ids: string[]) => void
}

const PublisherActionModal: React.FC<PublisherActionModalProps> = ({
    isOpen,
    onClose,
    publisher,
    onStatusChange,
    onDelete,
}) => {
    const [actionNote, setActionNote] = useState('')
    const [selectedStatus, setSelectedStatus] = useState<'pending' | 'verified' | 'rejected' | 'hold' | 'pause' | null>(null)
    const [showNoteInput, setShowNoteInput] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [verificationResult, setVerificationResult] = useState<{ success: boolean; message?: string } | null>(null)
    const [copiedToken, setCopiedToken] = useState(false)

    const authedUser = useAppSelector((store) => store.auth.user)

    if (!publisher) return null

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'verified':
                return 'text-green-400 bg-green-400/10 border-green-400/20'
            case 'rejected':
                return 'text-red-400 bg-red-400/10 border-red-400/20'
            case 'hold':
                return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
            case 'pause':
                return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
            case 'pending':
                return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
            default:
                return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'verified':
                return <CheckCircle size={14} className="text-green-400" />
            case 'rejected':
                return <AlertCircle size={14} className="text-red-400" />
            case 'hold':
                return <AlertCircle size={14} className="text-yellow-400" />
            case 'pause':
                return <PauseCircle size={14} className="text-orange-400" />
            case 'pending':
                return <Clock size={14} className="text-blue-400" />
            default:
                return <Clock size={14} className="text-gray-400" />
        }
    }

    const formatStatus = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'pending': 'Pending Verification',
            'verified': 'Verified',
            'rejected': 'Rejected',
            'hold': 'On Hold',
            'pause': 'Paused'
        }
        return statusMap[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1)
    }

    const formatAccountType = (type: string) => {
        const typeMap: { [key: string]: string } = {
            'company': 'Company Account',
            'individual': 'Individual Account'
        }
        return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1)
    }

    const getAccountTypeIcon = (type: string) => {
        switch (type) {
            case 'company':
                return <Building size={14} className="text-blue-400" />
            case 'individual':
                return <User size={14} className="text-purple-400" />
            default:
                return <User size={14} className="text-gray-400" />
        }
    }

    const truncateText = (text: string, maxLength: number = 40) => {
        if (!text || text === "Not provided") return "Not provided"
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    const handleStatusUpdate = (status: 'pending' | 'verified' | 'rejected' | 'hold' | 'pause') => {
        setSelectedStatus(status)
        setShowNoteInput(true)
    }

    const submitStatusWithNote = () => {
        if (selectedStatus) {
            const finalNote = actionNote || `Status changed to ${formatStatus(selectedStatus)} by ${authedUser?.email}`
            onStatusChange(publisher._id, selectedStatus, finalNote)
            handleClose()
        }
    }

    const handleClose = () => {
        setActionNote('')
        setSelectedStatus(null)
        setShowNoteInput(false)
        setIsVerifying(false)
        setVerificationResult(null)
        onClose()
    }

    const handleDelete = () => {
        onDelete([publisher._id])
        handleClose()
    }

    const handleVerifyWebsite = async () => {
        if (!publisher.website || publisher.website === "Not provided" || !publisher.verificationToken) {
            setVerificationResult({
                success: false,
                message: publisher.website === "Not provided" ? "No website provided" : "No verification token found"
            })
            return
        }

        setIsVerifying(true)
        setVerificationResult(null)


        try {
            const payload = {
                userId: publisher?.userId._id,
                website: publisher?.website
            }
            const response = await appClient.post(`/api/publisher/meta-verification`, payload)
            if (response.data.status) {
                setVerificationResult({
                    success: response.data.status,
                    message: response.data.message
                })
                // Auto-update status to verified on successful verification
                onStatusChange(publisher._id, 'verified', `Website verified successfully by ${authedUser?.email}. ${response.data.message || ''}`)
            }
        } catch (error) {
            setVerificationResult({
                success: false,
                message: "Verification failed. Please try again."
            })
        } finally {
            setIsVerifying(false)
        }

    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedToken(true)
        setTimeout(() => setCopiedToken(false), 2000)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl max-h-[90vh] overflow-y-auto z-50"
                    >
                        <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] rounded-xl border border-[#333] shadow-2xl m-4">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-[#333]">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-gradient-to-br from-[#bf953f]/20 to-[#d4af37]/20 rounded-lg">
                                        <Shield size={20} className="text-[#bf953f]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Publisher Management</h2>
                                        <p className="text-gray-400 text-xs">Manage publisher account and verification</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-1.5 rounded-lg bg-[#333] hover:bg-[#444] transition-colors"
                                >
                                    <X size={16} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Content - Left Right Layout */}
                            <div className="flex flex-col lg:flex-row">
                                {/* Left Panel - Publisher Details */}
                                <div className="lg:w-2/5 border-r border-[#333] p-4 space-y-4">
                                    {/* Publisher Info */}
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#bf953f]/20 to-[#d4af37]/20 rounded-lg flex items-center justify-center">
                                                <span className="text-[#bf953f] text-lg font-bold">
                                                    {publisher.fullName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold text-lg">{publisher.fullName}</h3>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    {getAccountTypeIcon(publisher.accountType)}
                                                    <span className="text-gray-300 text-sm">
                                                        {formatAccountType(publisher.accountType)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {publisher.organizationName && publisher.organizationName !== "Not provided" && (
                                            <div>
                                                <div className="text-gray-400 text-xs mb-1">Organization</div>
                                                <div className="text-white text-sm bg-[#1a1a1a] px-3 py-2 rounded-lg border border-[#333]">
                                                    {publisher.organizationName}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Contact Information */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-white flex items-center">
                                            <Mail size={14} className="mr-2 text-blue-400" />
                                            Contact Information
                                        </h4>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Email:</span>
                                                <span className="text-white font-medium">{publisher.userId.email}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Phone:</span>
                                                <span className="text-white font-medium">
                                                    {publisher.countryCode} {publisher.phoneNumber}
                                                </span>
                                            </div>
                                            {publisher.telegramUsername && publisher.telegramUsername !== "Not provided" && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400">Telegram:</span>
                                                    <span className="text-[#bf953f] font-medium">
                                                        @{publisher.telegramUsername.replace('@', '')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Website & Links */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-white flex items-center">
                                            <Globe size={14} className="mr-2 text-green-400" />
                                            Website & Links
                                        </h4>
                                        <div className="space-y-2">
                                            {publisher.website && publisher.website !== "Not provided" && (
                                                <a
                                                    href={publisher.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-2 bg-[#1a1a1a] hover:bg-[#222] rounded-lg border border-[#333] transition-colors"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <Globe size={12} className="text-blue-400" />
                                                        <span className="text-white text-xs truncate max-w-[150px]">
                                                            {publisher.website.replace(/^https?:\/\//, '')}
                                                        </span>
                                                    </div>
                                                    <ExternalLink size={12} className="text-gray-400" />
                                                </a>
                                            )}

                                            {publisher.profileLink && publisher.profileLink !== "Not provided" && (
                                                <a
                                                    href={publisher.profileLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-2 bg-[#1a1a1a] hover:bg-[#222] rounded-lg border border-[#333] transition-colors"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <LinkIcon size={12} className="text-purple-400" />
                                                        <span className="text-white text-xs truncate max-w-[150px]">
                                                            Profile Link
                                                        </span>
                                                    </div>
                                                    <ExternalLink size={12} className="text-gray-400" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Current Status */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-white">Current Status</h4>
                                        <div className="flex items-center space-x-2">
                                            <div className={`px-3 py-1.5 rounded-lg border ${getStatusColor(publisher.verificationStatus)} font-medium flex items-center space-x-2 text-xs`}>
                                                {getStatusIcon(publisher.verificationStatus)}
                                                <span>{formatStatus(publisher.verificationStatus)}</span>
                                            </div>
                                        </div>
                                        {publisher.actionTakenBy && (
                                            <div className="text-gray-400 text-xs">
                                                Last action by: {publisher.actionTakenBy.email}
                                            </div>
                                        )}
                                        {publisher.actionNote && (
                                            <div className="text-gray-400 text-xs">
                                                Note: {truncateText(publisher.actionNote, 60)}
                                            </div>
                                        )}
                                        <div className="text-gray-400 text-xs">
                                            Submitted: {new Date(publisher.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {publisher.publisherInfo && publisher.publisherInfo !== "Not provided" && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold text-white flex items-center">
                                                <FileText size={14} className="mr-2 text-gray-400" />
                                                Description
                                            </h4>
                                            <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#333] max-h-32 overflow-y-auto">
                                                <p className="text-gray-300 text-xs leading-relaxed">
                                                    {publisher.publisherInfo}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Panel - Actions & Verification */}
                                <div className="lg:w-3/5 p-4 space-y-6">
                                    {!showNoteInput ? (
                                        <>
                                            {/* Status Management */}
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-semibold text-white">Update Publisher Status</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {/* Verified */}
                                                    {publisher.verificationStatus !== 'verified' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate('verified')}
                                                            className="flex flex-col items-center justify-center space-y-2 p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 transition-colors text-sm"
                                                        >
                                                            <CheckCircle size={18} />
                                                            <span>Mark as Verified</span>
                                                        </button>
                                                    )}

                                                    {/* Rejected */}
                                                    {publisher.verificationStatus !== 'rejected' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate('rejected')}
                                                            className="flex flex-col items-center justify-center space-y-2 p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors text-sm"
                                                        >
                                                            <AlertCircle size={18} />
                                                            <span>Reject Publisher</span>
                                                        </button>
                                                    )}

                                                    {/* On Hold */}
                                                    {publisher.verificationStatus !== 'hold' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate('hold')}
                                                            className="flex flex-col items-center justify-center space-y-2 p-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-400 transition-colors text-sm"
                                                        >
                                                            <AlertCircle size={18} />
                                                            <span>Put On Hold</span>
                                                        </button>
                                                    )}

                                                    {/* Pause */}
                                                    {publisher.verificationStatus !== 'pause' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate('pause')}
                                                            className="flex flex-col items-center justify-center space-y-2 p-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg text-orange-400 transition-colors text-sm"
                                                        >
                                                            <PauseCircle size={18} />
                                                            <span>Pause Account</span>
                                                        </button>
                                                    )}

                                                    {/* Set Pending */}
                                                    {publisher.verificationStatus !== 'pending' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate('pending')}
                                                            className="flex flex-col items-center justify-center space-y-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors text-sm"
                                                        >
                                                            <Clock size={18} />
                                                            <span>Set as Pending</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Website Verification */}
                                            {publisher.website && publisher.website !== "Not provided" && (
                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-semibold text-white flex items-center justify-between">
                                                        <span className="flex items-center">
                                                            <Shield size={14} className="mr-2 text-[#bf953f]" />
                                                            Website Verification
                                                        </span>
                                                        {publisher.verificationStatus === 'verified' && (
                                                            <span className="text-green-400 text-xs">✓ Verified</span>
                                                        )}
                                                    </h3>

                                                    <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#333] space-y-3">
                                                        {/* Website URL */}
                                                        <div>
                                                            <div className="text-gray-400 text-xs mb-1">Website URL</div>
                                                            <div className="text-white text-sm break-all">{publisher.website}</div>
                                                        </div>

                                                        {/* Verification Token */}
                                                        <div>
                                                            <div className="text-gray-400 text-xs mb-1">Verification Token</div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="text-white text-sm font-mono bg-[#2a2a2a] px-3 py-1.5 rounded border border-[#333] flex-1 mr-2 truncate">
                                                                    {publisher.verificationToken || "No token generated"}
                                                                </div>
                                                                {publisher.verificationToken && (
                                                                    <button
                                                                        onClick={() => copyToClipboard(publisher.verificationToken)}
                                                                        className="flex items-center space-x-1 px-3 py-1.5 bg-[#333] hover:bg-[#444] text-white rounded text-xs transition-colors"
                                                                    >
                                                                        {copiedToken ? (
                                                                            <>
                                                                                <Check size={12} />
                                                                                <span>Copied</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Copy size={12} />
                                                                                <span>Copy</span>
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Verification Instructions */}
                                                        <div className="text-gray-400 text-xs">
                                                            <div className="font-semibold mb-1">To verify ownership:</div>
                                                            <ol className="list-decimal list-inside space-y-1">
                                                                <li>Publisher must add the meta tag to their website</li>
                                                                <li>Click "Verify Now" to check if meta tag is present</li>
                                                                <li>Status will auto-update to "Verified" if successful</li>
                                                            </ol>
                                                        </div>

                                                        {/* Verify Button */}
                                                        <button
                                                            onClick={handleVerifyWebsite}
                                                            disabled={isVerifying || !publisher.verificationToken || publisher.website === "Not provided"}
                                                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#bf953f] to-[#d4af37] hover:from-[#d4af37] hover:to-[#e6c064] disabled:from-[#bf953f]/50 disabled:to-[#d4af37]/50 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-all duration-200 text-sm"
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

                                                        {/* Verification Result */}
                                                        {verificationResult && (
                                                            <div className={`p-2 rounded-lg border text-xs ${verificationResult.success ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                                                {verificationResult.success ? '✓ ' : '✗ '}
                                                                {verificationResult.message || (verificationResult.success ? 'Website verified successfully!' : 'Verification failed')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Quick Actions */}
                                            <div className="space-y-3">
                                                <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    <button
                                                        onClick={handleDelete}
                                                        className="flex items-center justify-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors text-sm"
                                                    >
                                                        <Trash2 size={14} />
                                                        <span>Delete Publisher</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        /* Action Note Input */
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-white flex items-center">
                                                <FileText size={14} className="mr-2 text-[#bf953f]" />
                                                Action Note for {selectedStatus && formatStatus(selectedStatus)}
                                            </h3>

                                            <div className="space-y-3">
                                                <div className="text-gray-400 text-xs">
                                                    Please provide details about this status change. This will be recorded in the audit trail.
                                                </div>
                                                <textarea
                                                    value={actionNote}
                                                    onChange={(e) => setActionNote(e.target.value)}
                                                    placeholder={`Enter action note for ${selectedStatus && formatStatus(selectedStatus)} status...`}
                                                    className="w-full h-40 px-3 py-2 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f] resize-none text-sm"
                                                />
                                            </div>

                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => setShowNoteInput(false)}
                                                    className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg text-sm transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={submitStatusWithNote}
                                                    disabled={!actionNote.trim()}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#bf953f] to-[#d4af37] hover:from-[#d4af37] hover:to-[#e6c064] disabled:from-[#bf953f]/50 disabled:to-[#d4af37]/50 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-all duration-200 text-sm"
                                                >
                                                    <Send size={14} />
                                                    <span>Update Status</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center p-4 border-t border-[#333]">
                                <div className="text-gray-400 text-xs">
                                    Admin: {authedUser?.email}
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg text-sm transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default PublisherActionModal