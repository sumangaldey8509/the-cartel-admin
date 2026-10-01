import { X } from 'lucide-react';

interface NicheModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    nicheName: string;
    setNicheName: (name: string) => void;
    editing: boolean;
    loading?: boolean;
}

const NicheModal = ({
    isOpen,
    onClose,
    onSubmit,
    nicheName,
    setNicheName,
    editing,
    loading = false
}: NicheModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">
                        {editing ? 'Edit Niche' : 'Add New Niche'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-700 rounded-lg"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Niche Name
                        </label>
                        <input
                            type="text"
                            value={nicheName}
                            onChange={(e) => setNicheName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Enter niche name"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSubmit}
                            disabled={!nicheName.trim() || loading}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {editing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NicheModal;