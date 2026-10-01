// components/ConsultationActionModal.tsx
import { consultaion } from '@/interface/consultation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Clock, Phone, Wrench, ThumbsUp, User, Mail, MessageCircle, Send, Eye, Trash2, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface ConsultationActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    consultation: consultaion | null;
    onStatusChange: (id: string, status: 'pending' | 'not-contacted' | 'contacted' | 'in-progress' | 'resolved', actionNote?: string) => void;
    onDelete: (ids: string[]) => void;
}

const ConsultationActionModal: React.FC<ConsultationActionModalProps> = ({
    isOpen,
    onClose,
    consultation,
    onStatusChange,
    onDelete
}) => {
    const [actionNote, setActionNote] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<'pending' | 'not-contacted' | 'contacted' | 'in-progress' | 'resolved' | null>(null);
    const [showNoteInput, setShowNoteInput] = useState(false);

    if (!consultation) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved':
                return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'in-progress':
                return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'contacted':
                return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'not-contacted':
                return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'pending':
                return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            default:
                return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'resolved':
                return <ThumbsUp size={14} className="text-green-400" />;
            case 'in-progress':
                return <Wrench size={14} className="text-blue-400" />;
            case 'contacted':
                return <Phone size={14} className="text-purple-400" />;
            case 'not-contacted':
                return <Clock size={14} className="text-yellow-400" />;
            case 'pending':
                return <Clock size={14} className="text-orange-400" />;
            default:
                return <Clock size={14} className="text-gray-400" />;
        }
    };

    const getTopicColor = (topic: string) => {
        switch (topic) {
            case "token-launch":
                return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case "marketing":
                return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case "listing":
                return 'text-green-400 bg-green-400/10 border-green-400/20';
            case "community":
                return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            default:
                return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    const formatTopic = (topic: string) => {
        const topicMap: { [key: string]: string } = {
            'token-launch': 'Token Launch',
            'marketing': 'Marketing Strategy',
            'listing': 'Coin Listing Help',
            'community': 'Community Growth',
            'other': 'Other'
        }
        return topicMap[topic] || topic;
    };

    const formatStatus = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'pending': 'Pending',
            'not-contacted': 'Not Contacted',
            'contacted': 'Contacted',
            'in-progress': 'In Progress',
            'resolved': 'Resolved'
        }
        return statusMap[status] || status;
    };

    const handleStatusUpdate = (status: 'pending' | 'not-contacted' | 'contacted' | 'in-progress' | 'resolved') => {
        // Always show note input for status changes
        setSelectedStatus(status);
        setShowNoteInput(true);
    };

    const submitStatusWithNote = () => {
        if (selectedStatus) {
            onStatusChange(consultation._id, selectedStatus, actionNote);
            handleClose();
        }
    };

    const handleClose = () => {
        setActionNote('');
        setSelectedStatus(null);
        setShowNoteInput(false);
        onClose();
    };

    const handleDelete = () => {
        onDelete([consultation._id]);
        handleClose();
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
                                    <h2 className="text-lg font-bold text-white">Consultation Management</h2>
                                    <p className="text-gray-400 text-xs">Manage consultation request</p>
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
                                {/* Left Panel - Consultation Details */}
                                <div className="lg:w-2/5 border-r border-[#333] p-4 space-y-4">
                                    {/* User Info */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-white flex items-center">
                                            <User size={14} className="mr-2 text-blue-400" />
                                            Client Details
                                        </h3>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Name:</span>
                                                <span className="text-white font-medium">{consultation.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Email:</span>
                                                <span className="text-white font-medium text-xs">{consultation.email}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Telegram:</span>
                                                <span className="text-[#bf953f] font-medium text-xs">{consultation.telegram || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Consultation Info */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-white flex items-center">
                                            <MessageCircle size={14} className="mr-2 text-[#bf953f]" />
                                            Consultation Details
                                        </h3>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Topic:</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTopicColor(consultation.topic)}`}>
                                                    {formatTopic(consultation.topic)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Session Rate:</span>
                                                <span className="text-[#bf953f] font-bold">$49 / 60 min</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Current Status */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-white">Current Status</h3>
                                        <div className="flex items-center space-x-2">
                                            <div className={`px-3 py-1.5 rounded-lg border ${getStatusColor(consultation.status)} font-medium flex items-center space-x-2 text-xs`}>
                                                {getStatusIcon(consultation.status)}
                                                <span>{formatStatus(consultation.status)}</span>
                                            </div>
                                        </div>
                                        {consultation.actionTakenBy && (
                                            <div className="text-gray-400 text-xs">
                                                by {consultation.actionTakenBy.email}
                                            </div>
                                        )}
                                        <div className="text-gray-400 text-xs">
                                            Submitted: {new Date(consultation.createdAt).toLocaleDateString()}
                                        </div>
                                        {consultation.updatedAt !== consultation.createdAt && (
                                            <div className="text-gray-400 text-xs">
                                                Updated: {new Date(consultation.updatedAt).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Project Details */}
                                    {consultation.message && (
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-semibold text-white flex items-center">
                                                <MessageSquare size={14} className="mr-2 text-blue-400" />
                                                Project Details
                                            </h3>
                                            <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#333]">
                                                <p className="text-gray-300 text-xs leading-relaxed">
                                                    {consultation.message}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Quick Actions */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
                                        <div className="space-y-2">
                                            <button
                                                onClick={handleDelete}
                                                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors text-xs"
                                            >
                                                <Trash2 size={14} />
                                                <span>Delete Consultation</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Panel - Status Management */}
                                <div className="lg:w-3/5 p-4">
                                    {!showNoteInput ? (
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-white mb-3">Update Consultation Status</h3>

                                            {/* Status Actions Grid */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Not Contacted */}
                                                {consultation.status !== 'not-contacted' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate('not-contacted')}
                                                        className="flex items-center justify-center space-x-2 p-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-400 transition-colors text-sm"
                                                    >
                                                        <Clock size={16} />
                                                        <span>Not Contacted</span>
                                                    </button>
                                                )}

                                                {/* Contacted */}
                                                {consultation.status !== 'contacted' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate('contacted')}
                                                        className="flex items-center justify-center space-x-2 p-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 transition-colors text-sm"
                                                    >
                                                        <Phone size={16} />
                                                        <span>Contacted</span>
                                                    </button>
                                                )}

                                                {/* In Progress */}
                                                {consultation.status !== 'in-progress' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate('in-progress')}
                                                        className="flex items-center justify-center space-x-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors text-sm"
                                                    >
                                                        <Wrench size={16} />
                                                        <span>In Progress</span>
                                                    </button>
                                                )}

                                                {/* Resolved */}
                                                {consultation.status !== 'resolved' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate('resolved')}
                                                        className="flex items-center justify-center space-x-2 p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 transition-colors text-sm"
                                                    >
                                                        <ThumbsUp size={16} />
                                                        <span>Resolved</span>
                                                    </button>
                                                )}

                                                {/* Set Pending */}
                                                {consultation.status !== 'pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate('pending')}
                                                        className="flex items-center justify-center space-x-2 p-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg text-orange-400 transition-colors text-sm"
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
                                                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                                        <span className="text-gray-300">Pending - Initial submission</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                                        <span className="text-gray-300">Not Contacted - Awaiting initial contact</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                                        <span className="text-gray-300">Contacted - Initial contact made</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                        <span className="text-gray-300">In Progress - Consultation ongoing</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                        <span className="text-gray-300">Resolved - Consultation completed</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-gray-400 text-xs text-center">
                                                Note: All status changes require an action note for tracking
                                            </p>
                                        </div>
                                    ) : (
                                        /* Action Note Input */
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-white flex items-center">
                                                <MessageSquare size={14} className="mr-2 text-[#bf953f]" />
                                                Action Note for {selectedStatus && formatStatus(selectedStatus)}
                                            </h3>

                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-400">
                                                    Describe the action taken or reason for status change:
                                                </label>
                                                <textarea
                                                    value={actionNote}
                                                    onChange={(e) => setActionNote(e.target.value)}
                                                    placeholder={`Enter action note for ${selectedStatus && formatStatus(selectedStatus)} status...`}
                                                    className="w-full h-32 px-3 py-2 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f] resize-none text-sm"
                                                />
                                            </div>

                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => setShowNoteInput(false)}
                                                    className="px-3 py-1.5 bg-[#333] hover:bg-[#444] text-white rounded text-xs transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={submitStatusWithNote}
                                                    disabled={!actionNote.trim()}
                                                    className="flex items-center space-x-1 px-3 py-1.5 bg-[#bf953f] hover:bg-[#d4af37] disabled:bg-[#bf953f]/50 disabled:cursor-not-allowed text-black rounded text-xs transition-colors"
                                                >
                                                    <Send size={12} />
                                                    <span>Update Status</span>
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

export default ConsultationActionModal;