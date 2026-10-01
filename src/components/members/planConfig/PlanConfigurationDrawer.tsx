"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Plus,
    Edit3,
    Trash2,
    Save,
    Loader2,
    Crown,
    AlertCircle,
    CheckCircle,
    Search,
    Filter,
    Calendar,
    DollarSign,
    Tag
} from "lucide-react";
import appClient from "@/lib/appClient";
import { Plan, PlanFormData } from "@/interface/plan";

interface PlanConfigurationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const PlanConfigurationDrawer = ({ isOpen, onClose }: PlanConfigurationDrawerProps) => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBestValue, setFilterBestValue] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState<PlanFormData>({
        name: "",
        price: "",
        oldPrice: "",
        duration: "",
        isBestValue: false
    });

    // Fetch plans
    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await appClient.get("/api/plan/get");
            if (response.data.status) {
                setPlans(response.data.data);
            }
        } catch (error) {
            showMessage('error', 'Failed to fetch plans');
        } finally {
            setLoading(false);
        }
    };

    // Show message helper
    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            oldPrice: "",
            duration: "",
            isBestValue: false
        });
        setEditingPlan(null);
        setIsCreating(false);
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    // Create new plan
    const handleCreate = async () => {
        if (!formData.name || !formData.duration || Number(formData.price) <= 0) {
            showMessage('error', 'Please fill all required fields with valid values');
            return;
        }

        try {
            setLoading(true);
            const response = await appClient.post("/api/plan/create", formData);

            if (response.data.status) {
                showMessage('success', 'Plan created successfully!');
                await fetchPlans();
                resetForm();
            }
        } catch (error) {
            showMessage('error', 'Failed to create plan');
        } finally {
            setLoading(false);
        }
    };

    // Update existing plan
    const handleUpdate = async () => {
        if (!editingPlan?._id) return;

        if (!formData.name || !formData.duration || Number(formData.price) <= 0) {
            showMessage('error', 'Please fill all required fields with valid values');
            return;
        }

        try {
            setLoading(true);
            const response = await appClient.put(`/api/plan/update/${editingPlan._id}`, formData);
            if (response.data.status) {
                showMessage('success', 'Plan updated successfully!');
                await fetchPlans();
                resetForm();
            }
        } catch (error) {
            showMessage('error', 'Failed to update plan');
        } finally {
            setLoading(false);
        }
    };

    // Delete plan
    const handleDelete = async (planId: string[]) => {
        if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) return;

        try {
            setLoading(true);
            const response = await appClient.delete(`/api/plan/delete/`, {
                params: { ids: JSON.stringify(planId) }
            });
            if (response.data.status) {
                showMessage('success', 'Plan deleted successfully!');
                await fetchPlans();
            }
        } catch (error) {
            showMessage('error', 'Failed to delete plan');
        } finally {
            setLoading(false);
        }
    };

    // Start editing a plan
    const startEditing = (plan: Plan) => {
        setEditingPlan(plan);
        setIsCreating(false);
        setFormData({
            name: plan.name,
            price: plan.price,
            oldPrice: plan.oldPrice,
            duration: plan.duration,
            isBestValue: plan.isBestValue
        });
    };

    // Start creating new plan
    const startCreating = () => {
        resetForm();
        setIsCreating(true);
        setEditingPlan(null);
    };

    // Filtered plans
    const filteredPlans = plans.filter(plan => {
        const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.duration.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = !filterBestValue || plan.isBestValue;
        return matchesSearch && matchesFilter;
    });

    // Close drawer when ESC pressed
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Fetch plans when drawer opens
    useEffect(() => {
        if (isOpen) {
            fetchPlans();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Drawer */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 h-full w-full max-w-4xl z-50"
            >
                <div className="h-full bg-[#1e1e1e] border-l border-[#bf953f]/20 shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#1e1e1e] to-[#2a2a2a] border-b border-[#bf953f]/20 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-[#C0C0C0]">
                                    Plan Configuration
                                </h2>
                                <p className="text-[#bf953f] text-sm mt-1">Manage your subscription plans</p>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[#bf953f]/10 rounded-lg border border-[#bf953f]/20 transition-all text-[#bf953f] hover:text-[#feb56a]"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Message Alert */}
                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`mx-6 mt-4 p-4 rounded-lg border ${message.type === 'success'
                                    ? 'bg-[#4ade80]/10 border-[#4ade80]/30'
                                    : 'bg-[#f87171]/10 border-[#f87171]/30'
                                    }`}
                            >
                                <div className="flex items-center space-x-2">
                                    {message.type === 'success' ? (
                                        <CheckCircle className="w-5 h-5 text-[#4ade80]" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-[#f87171]" />
                                    )}
                                    <span className={`text-sm ${message.type === 'success' ? 'text-[#4ade80]' : 'text-[#f87171]'
                                        }`}>
                                        {message.text}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="h-full overflow-y-auto">
                        <div className="p-6 space-y-6">

                            {/* Search and Filter Bar */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#bf953f]" />
                                        <input
                                            type="text"
                                            placeholder="Search plans..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-[#bf953f]/30 rounded-lg text-white placeholder-[#bf953f]/50 focus:outline-none focus:border-[#bf953f]"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Filter className="w-4 h-4 text-[#bf953f]" />
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filterBestValue}
                                            onChange={(e) => setFilterBestValue(e.target.checked)}
                                            className="w-4 h-4 text-[#bf953f] bg-[#2a2a2a] border-[#bf953f] rounded focus:ring-[#bf953f]"
                                        />
                                        <span className="text-[#C0C0C0] text-sm">Best Value Only</span>
                                    </label>
                                </div>
                            </div>

                            {/* Form Section */}
                            <div className="bg-[#2a2a2a] rounded-lg border border-[#bf953f]/20 p-6">
                                <h3 className="text-lg font-bold text-[#C0C0C0] mb-4">
                                    {isCreating ? 'Create New Plan' : editingPlan ? 'Edit Plan' : 'Add New Plan'}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#C0C0C0] mb-2">
                                            <Tag size={16} className="inline mr-2" />
                                            Plan Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 1 Month - $289"
                                            className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#bf953f]/30 rounded-lg text-white-800 focus:outline-none focus:border-[#bf953f] placeholder-[#bf953f]/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#C0C0C0] mb-2">
                                            <Calendar size={16} className="inline mr-2" />
                                            Duration *
                                        </label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 1 Month"
                                            className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#bf953f]/30 rounded-lg text-white-800 focus:outline-none focus:border-[#bf953f] placeholder-[#bf953f]/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#C0C0C0] mb-2">
                                            <DollarSign size={16} className="inline mr-2" />
                                            Price ($) *
                                        </label>
                                        <input
                                            type="text"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#bf953f]/30 rounded-lg text-white-800 focus:outline-none focus:border-[#bf953f] placeholder-[#bf953f]/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#C0C0C0] mb-2">
                                            <DollarSign size={16} className="inline mr-2" />
                                            Old Price ($)
                                        </label>
                                        <input
                                            type="text"
                                            name="oldPrice"
                                            value={formData.oldPrice}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#bf953f]/30 rounded-lg text-white-800 focus:outline-none focus:border-[#bf953f] placeholder-[#bf953f]/50"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isBestValue"
                                                checked={formData.isBestValue}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 text-[#bf953f] bg-[#1e1e1e] border-[#bf953f] rounded focus:ring-[#bf953f]"
                                            />
                                            <span className="text-[#C0C0C0]">
                                                <Crown size={16} className="inline mr-2" />
                                                Mark as Best Value Plan
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex space-x-3 mt-6">
                                    <>
                                        <button
                                            onClick={!editingPlan ? handleCreate : handleUpdate}
                                            disabled={loading}
                                            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-[#bf953f] to-[#feb56a] text-black font-bold rounded-lg disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            <span>{!editingPlan ? 'Create' : 'Update'}</span>
                                        </button>

                                        <button
                                            onClick={resetForm}
                                            className="px-6 py-2 border border-[#bf953f]/30 text-[#bf953f] rounded-lg hover:bg-[#bf953f]/10"
                                        >
                                            Cancel
                                        </button>
                                    </>

                                </div>
                            </div>

                            {/* Plans List */}
                            <div>
                                <h3 className="text-lg font-bold text-[#C0C0C0] mb-4">
                                    Plans List ({filteredPlans.length})
                                </h3>

                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="w-8 h-8 text-[#bf953f] animate-spin" />
                                    </div>
                                ) : filteredPlans.length === 0 ? (
                                    <div className="text-center py-12 text-[#bf953f]/70">
                                        {plans.length === 0 ? 'No plans found. Create your first plan!' : 'No plans match your search.'}
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {filteredPlans.map((plan) => (
                                            <motion.div
                                                key={plan._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-[#2a2a2a] border border-[#bf953f]/20 rounded-lg p-4 hover:border-[#bf953f]/40 transition-all"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3">
                                                            <h4 className="text-[#C0C0C0] font-bold text-lg">
                                                                {plan.name}
                                                                {plan.isBestValue && (
                                                                    <span className="ml-2 bg-gradient-to-r from-[#bf953f] to-[#feb56a] text-black px-2 py-1 rounded-full text-xs">
                                                                        Best Value
                                                                    </span>
                                                                )}
                                                            </h4>
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                                                            <div>
                                                                <span className="text-[#bf953f]">Duration:</span>
                                                                <span className="text-[#C0C0C0] ml-2">{plan.duration}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-[#bf953f]">Price:</span>
                                                                <span className="text-[#4ade80] ml-2">${plan.price}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-[#bf953f]">Old Price:</span>
                                                                <span className="text-[#f87171] ml-2 line-through">${plan.oldPrice}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex space-x-2 ml-4">
                                                        <button
                                                            onClick={() => plan._id && handleDelete([plan._id])}
                                                            className="p-2 bg-[#f87171]/10 border border-[#f87171]/30 rounded-lg hover:bg-[#f87171]/20 transition-all"
                                                            title="Delete plan"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-[#f87171]" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <style jsx>{`
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #2a2a2a;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #bf953f;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #feb56a;
        }
      `}</style>
        </>
    );
};

export default PlanConfigurationDrawer;