

import { Blog } from "@/app/(main)/news/page";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

// Delete Confirmation Dialog Component
interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    blog: Blog | null;
    isLoading?: boolean;
}



const DeleteDialog = ({ isOpen, onClose, onConfirm, blog, isLoading = false }: DeleteDialogProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6"
                    >
                        <div className="bg-[#1A1A1A] border border-red-500/30 rounded-xl shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center gap-3 p-6 border-b border-[#333]">
                                <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white-800">Delete Article</h3>
                                    <p className="text-[#C0C0C0] text-sm mt-1">This action cannot be undone</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-[#C0C0C0]">
                                    Are you sure you want to delete the article{" "}
                                    <span className="text-white-800 font-semibold">&quot;{blog?.heading}&quot;</span>?
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 p-6 border-t border-[#333]">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2.5 bg-[#333] text-white-800 rounded-lg hover:bg-[#444] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2.5 bg-red-500 text-white-800 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DeleteDialog