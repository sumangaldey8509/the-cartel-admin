import { Trash2 } from 'lucide-react';

interface SelectionBarProps {
    count: number;
    onDelete: () => void;
    type: 'niche' | 'category';
}

const SelectionBar = ({ count, onDelete, type }: SelectionBarProps) => {
    const typeText = type === 'niche' ? 'niche(s)' : 'category(s)';

    return (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-center justify-between">
            <span>{count} {typeText} selected</span>
            <button
                onClick={onDelete}
                className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
                <Trash2 className="w-4 h-4" />
                Delete Selected
            </button>
        </div>
    );
};

export default SelectionBar;