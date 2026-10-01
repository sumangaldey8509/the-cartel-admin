// components/ActionModal.tsx
import { TokenSubmission } from '@/interface/request';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Clock, User, Building2, FileText, ExternalLink, MessageCircle, Send, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: TokenSubmission | null;
    onStatusChange: (id: string, status: 'pending' | 'verified' | 'published' | 'rejected', remarks?: string) => void;
    onDelete: (ids: string[]) => void;
    onViewPDF: (url: string) => void;
}

const ActionModal: React.FC<ActionModalProps> = ({
    isOpen,
    onClose,
    submission,
    onStatusChange,
    onDelete,
    onViewPDF
}) => {
    const [remarks, setRemarks] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<'pending' | 'verified' | 'published' | 'rejected' | null>(null);
    const [showRemarksInput, setShowRemarksInput] = useState(false);

    if (!submission) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'verified':
                return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'rejected':
                return 'text-red-400 bg-red-400/10 border-red-400/20';
            default:
                return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'published':
                return <Eye size={14} className="text-green-400" />;
            case 'verified':
                return <CheckCircle size={14} className="text-blue-400" />;
            case 'rejected':
                return <XCircle size={14} className="text-red-400" />;
            default:
                return <Clock size={14} className="text-yellow-400" />;
        }
    };

    const getPlanColor = (plan: string) => {
        switch (plan) {
            case 'premium':
                return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'enterprise':
                return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            default:
                return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        }
    };

    const handleStatusUpdate = (status: 'pending' | 'verified' | 'published' | 'rejected') => {
        if (status === 'rejected' || status === 'verified') {
            setSelectedStatus(status);
            setShowRemarksInput(true);
        } else {
            onStatusChange(submission._id, status);
            handleClose();
        }
    };

    const submitStatusWithRemarks = () => {
        if (selectedStatus) {
            onStatusChange(submission._id, selectedStatus, remarks);
            handleClose();
        }
    };

    const handleClose = () => {
        setRemarks('');
        setSelectedStatus(null);
        setShowRemarksInput(false);
        onClose();
    };

    const handleDelete = () => {
        onDelete([submission._id]);
        handleClose();
    };

    const handleViewPDF = () => {
        if (submission.pdfFileUrl) {
            onViewPDF(submission.pdfFileUrl);
        }
    };

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
                        className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[85vh] overflow-y-auto z-50"
                    >
                        <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] rounded-xl border border-[#333] shadow-2xl m-4">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-[#333]">
                                <div>
                                    <h2 className="text-lg font-bold text-white">Admin Actions</h2>
                                    <p className="text-gray-400 text-xs">Manage token submission</p>
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
                                {/* Left Panel - Submission Details */}
                                <div className="lg:w-2/5 border-r border-[#333] p-4 space-y-4">
                                    {/* User Info */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-white flex items-center">
                                            <User size={14} className="mr-2 text-blue-400" />
                                            User Details
                                        </h3>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Name:</span>
                                                <span className="text-white font-medium">{submission.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Type:</span>
                                                <div className="flex items-center space-x-1">
                                                    {submission.userType === 'organization' ? (
                                                        <Building2 size={12} className="text-blue-400" />
                                                    ) : (
                                                        <User size={12} className="text-green-400" />
                                                    )}
                                                    <span className="text-white font-medium capitalize text-xs">
                                                        {submission.userType}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Email:</span>
                                                <span className="text-white font-medium text-xs">{submission.email}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Telegram:</span>
                                                <span className="text-[#bf953f] font-medium text-xs">{submission.telegram}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Token Info */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-white flex items-center">
                                            <FileText size={14} className="mr-2 text-[#bf953f]" />
                                            Token Details
                                        </h3>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Name:</span>
                                                <span className="text-white font-medium">{submission.tokenName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Symbol:</span>
                                                <span className="text-[#bf953f] font-mono font-bold">{submission.tokenSymbol}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Plan:</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPlanColor(submission.plan)}`}>
                                                    {submission.plan.charAt(0).toUpperCase() + submission.plan.slice(1)}
                                                </span>
                                            </div>
                                            {submission.website && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400">Website:</span>
                                                    <a
                                                        href={submission.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 text-xs"
                                                    >
                                                        <span>Visit</span>
                                                        <ExternalLink size={12} />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Current Status */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-white">Current Status</h3>
                                        <div className="flex items-center space-x-2">
                                            <div className={`px-3 py-1.5 rounded-lg border ${getStatusColor(submission.status)} font-medium flex items-center space-x-2 text-xs`}>
                                                {getStatusIcon(submission.status)}
                                                <span>{submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}</span>
                                            </div>
                                        </div>
                                        {submission.actionTakenBy && (
                                            <div className="text-gray-400 text-xs">
                                                by {submission.actionTakenBy.email}
                                            </div>
                                        )}
                                        <div className="text-gray-400 text-xs">
                                            Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {submission.description && (
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-semibold text-white">Description</h3>
                                            <p className="text-gray-300 text-xs leading-relaxed line-clamp-4">
                                                {submission.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Quick Actions */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
                                        <div className="space-y-2">
                                            {submission.pdfFileUrl && (
                                                <button
                                                    onClick={handleViewPDF}
                                                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors text-xs"
                                                >
                                                    <FileText size={14} />
                                                    <span>View PDF</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={handleDelete}
                                                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors text-xs"
                                            >
                                                <Trash2 size={14} />
                                                <span>Delete Submission</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Panel - Status Management */}
                                <div className="lg:w-3/5 p-4">
                                    {!showRemarksInput ? (
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-white mb-3">Update Status</h3>

                                            {/* Status Actions Grid */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Publish */}
                                                {submission.status !== 'published' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate('published')}
                                                        className="flex items-center justify-center space-x-2 p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 transition-colors text-sm"
                                                    >
                                                        <Eye size={16} />
                                                        <span>Publish</span>
                                                    </button>
                                                )}

                                                {/* Verify */}
                                                {submission.status !== 'verified' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate('verified')}
                                                        className="flex items-center justify-center space-x-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors text-sm"
                                                    >
                                                        <CheckCircle size={16} />
                                                        <span>Verify</span>
                                                    </button>
                                                )}

                                                {/* Reject */}
                                                {submission.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate('rejected')}
                                                        className="flex items-center justify-center space-x-2 p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors text-sm"
                                                    >
                                                        <XCircle size={16} />
                                                        <span>Reject</span>
                                                    </button>
                                                )}

                                                {/* Set Pending */}
                                                {submission.status !== 'pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate('pending')}
                                                        className="flex items-center justify-center space-x-2 p-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-400 transition-colors text-sm"
                                                    >
                                                        <Clock size={16} />
                                                        <span>Set Pending</span>
                                                    </button>
                                                )}
                                            </div>

                                            {/* Status Legend */}
                                            <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#333]">
                                                <h4 className="text-xs font-semibold text-white mb-2">Status Guide</h4>
                                                <div className="space-y-1 text-xs">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                                        <span className="text-gray-300">Pending - Under review</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                        <span className="text-gray-300">Verified - Approved but not published</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                        <span className="text-gray-300">Published - Live on platform</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                                        <span className="text-gray-300">Rejected - Not approved</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-gray-400 text-xs text-center">
                                                Note: Verification and Rejection require remarks
                                            </p>
                                        </div>
                                    ) : (
                                        /* Remarks Input */
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-white flex items-center">
                                                <MessageCircle size={14} className="mr-2 text-[#bf953f]" />
                                                Remarks for {selectedStatus?.toUpperCase()}
                                            </h3>

                                            <textarea
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                                placeholder={`Enter remarks for ${selectedStatus} status...`}
                                                className="w-full h-24 px-3 py-2 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f] resize-none text-sm"
                                            />

                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => setShowRemarksInput(false)}
                                                    className="px-3 py-1.5 bg-[#333] hover:bg-[#444] text-white rounded text-xs transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={submitStatusWithRemarks}
                                                    disabled={!remarks.trim()}
                                                    className="flex items-center space-x-1 px-3 py-1.5 bg-[#bf953f] hover:bg-[#d4af37] disabled:bg-[#bf953f]/50 disabled:cursor-not-allowed text-black rounded text-xs transition-colors"
                                                >
                                                    <Send size={12} />
                                                    <span>Submit</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end p-3 border-t border-[#333]">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-1.5 bg-[#333] hover:bg-[#444] text-white rounded text-sm transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ActionModal;