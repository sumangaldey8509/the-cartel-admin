"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Trash2,
    Loader2,
    Crown,
    AlertCircle,
    CheckCircle,
    Search,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import appClient from "@/lib/appClient";
import { Plan, PlanFormData } from "@/interface/plan";
import Heading from "@/components/common/heading/heading";

const PlanConfigurationPage = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBestValue, setFilterBestValue] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [sortField, setSortField] = useState<keyof Plan>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
        setIsCreating(false);
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    // Create new plan
    const handleCreate = async () => {
        if (!formData.name || !formData.duration || !formData.price) {
            showMessage('error', 'Please fill all required fields');
            return;
        }

        try {
            setLoading(true);
            const response = await appClient.post("/api/plan/create", {
                ...formData,
                price: Number(formData.price),
                oldPrice: Number(formData.oldPrice) || 0
            });

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

    // Delete multiple plans
    const handleDeleteMultiple = async () => {
        if (selectedPlans.length === 0) {
            showMessage('error', 'Please select at least one plan to delete');
            return;
        }

        if (!confirm(`Are you sure you want to delete ${selectedPlans.length} plan(s)? This action cannot be undone.`)) return;

        try {
            setLoading(true);
            const response = await appClient.delete(`/api/plan/delete/`, {
                params: { ids: JSON.stringify(selectedPlans) }
            });
            if (response.data.status) {
                showMessage('success', `${selectedPlans.length} plan(s) deleted successfully!`);
                await fetchPlans();
                setSelectedPlans([]);
            }
        } catch (error) {
            showMessage('error', 'Failed to delete plans');
        } finally {
            setLoading(false);
        }
    };

    // Select/deselect all plans
    const toggleSelectAll = () => {
        if (selectedPlans.length === filteredPlans.length) {
            setSelectedPlans([]);
        } else {
            setSelectedPlans(filteredPlans.map(plan => plan._id!).filter(Boolean));
        }
    };

    // Toggle single plan selection
    const togglePlanSelection = (planId: string) => {
        setSelectedPlans(prev =>
            prev.includes(planId)
                ? prev.filter(id => id !== planId)
                : [...prev, planId]
        );
    };

    // Handle sorting
    const handleSort = (field: keyof Plan) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Sort icon component
    const SortIcon = ({ field }: { field: keyof Plan }) => {
        if (sortField !== field) return <ChevronDown className="w-4 h-4 opacity-50" />;
        return sortDirection === 'asc' ?
            <ChevronUp className="w-4 h-4 text-white-800 " /> :
            <ChevronDown className="w-4 h-4 text-white-800" />;
    };

    // Filtered and sorted plans
    const filteredPlans = plans
        .filter(plan => {
            const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                plan.duration.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = !filterBestValue || plan.isBestValue;
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }

            if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
                return sortDirection === 'asc' ? (aValue === bValue ? 0 : aValue ? -1 : 1) : (aValue === bValue ? 0 : aValue ? 1 : -1);
            }

            return 0;
        });

    // Calculate savings percentage
    const calculateSavings = (oldPrice: number, price: number) => {
        if (!oldPrice || oldPrice <= price) return 0;
        return Math.round(((oldPrice - price) / oldPrice) * 100);
    };

    // Fetch plans on component mount
    useEffect(() => {
        fetchPlans();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a] p-4">
            {/* Header */}
            <div className="mx-auto" >
                <Heading heading="Plan Configuration" subHeading="Manage your subscription plans" />

                {/* Message Alert */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`mb-6 p-4 rounded-lg border ${message.type === 'success'
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
                                <span className={`text-sm ${message.type === 'success' ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                                    {message.text}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#2a2a2a] rounded-lg border border-[#bf953f]/20 p-6 sticky top-6">
                            <h3 className="text-lg font-bold text-[#C0C0C0] mb-4">
                                Create New Plan
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#C0C0C0] mb-2">
                                        Plan Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Premium Monthly"
                                        className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#bf953f]/30 rounded-lg text-white-800 focus:outline-none focus:border-[#bf953f] placeholder-[#bf953f]/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#C0C0C0] mb-2">
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
                                        Price ($) *
                                    </label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="e.g - $99"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#bf953f]/30 rounded-lg text-white-800 focus:outline-none focus:border-[#bf953f] placeholder-[#bf953f]/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#C0C0C0] mb-2">
                                        Old Price ($)
                                    </label>
                                    <input
                                        type="text"
                                        name="oldPrice"
                                        value={formData.oldPrice}
                                        onChange={handleInputChange}
                                        placeholder="e.g - $199"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#bf953f]/30 rounded-lg text-white-800 focus:outline-none focus:border-[#bf953f] placeholder-[#bf953f]/50"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isBestValue"
                                            checked={formData.isBestValue}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-[#bf953f] bg-[#1e1e1e] border-[#bf953f] rounded focus:ring-[#bf953f]"
                                        />
                                        <span className="text-[#C0C0C0]">
                                            Mark as Best Value
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={handleCreate}
                                disabled={loading}
                                className="w-full mt-6 flex items-center justify-center space-x-2 px-6 py-2 bg-gradient-to-r from-[#bf953f] to-[#feb56a] text-black font-bold rounded-lg disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                <span>Create Plan</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Plans Table */}
                    <div className="lg:col-span-3">
                        {/* Search and Filter Bar */}
                        <div className="bg-[#2a2a2a] rounded-lg border border-[#bf953f]/20 p-4 mb-6">
                            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                                <div className="flex items-center space-x-4 w-full sm:w-auto">
                                    <div className="relative flex-1 sm:flex-none">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#bf953f]" />
                                        <input
                                            type="text"
                                            placeholder="Search plans..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-[#1e1e1e] border border-[#bf953f]/30 rounded-lg text-white-800 placeholder-[#bf953f]/50 focus:outline-none focus:border-[#bf953f]"
                                        />
                                    </div>

                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filterBestValue}
                                            onChange={(e) => setFilterBestValue(e.target.checked)}
                                            className="w-4 h-4 text-[#bf953f] bg-[#1e1e1e] border-[#bf953f] rounded focus:ring-[#bf953f]"
                                        />
                                        <span className="text-[#C0C0C0] text-sm">Best Value Only</span>
                                    </label>
                                </div>

                                <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
                                    <span className="text-[#C0C0C0] text-sm">
                                        {filteredPlans.length} plans found
                                    </span>

                                    {selectedPlans.length > 0 && (
                                        <button
                                            onClick={handleDeleteMultiple}
                                            className="flex items-center space-x-2 px-4 py-2 bg-[#f87171] text-white-800 rounded-lg hover:bg-[#dc2626] transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete ({selectedPlans.length})</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Plans Table */}
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 text-[#bf953f] animate-spin" />
                            </div>
                        ) : filteredPlans.length === 0 ? (
                            <div className="text-center py-12 text-[#bf953f]/70 bg-[#2a2a2a] rounded-lg border border-[#bf953f]/20">
                                {plans.length === 0 ? 'No plans found. Create your first plan!' : 'No plans match your search.'}
                            </div>
                        ) : (
                            <div className="bg-[#2a2a2a] rounded-lg border border-[#bf953f]/20 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-[#bf953f]/20">
                                                <th className="w-12 p-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPlans.length === filteredPlans.length && filteredPlans.length > 0}
                                                        onChange={toggleSelectAll}
                                                        className="w-4 h-4 text-[#bf953f] bg-[#1e1e1e] border-[#bf953f] rounded focus:ring-[#bf953f]"
                                                    />
                                                </th>
                                                <th
                                                    className="p-4 text-left cursor-pointer hover:bg-[#bf953f]/10 transition-colors"
                                                    onClick={() => handleSort('name')}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-semibold text-[#C0C0C0]">Plan Name</span>
                                                        <SortIcon field="name" />
                                                    </div>
                                                </th>
                                                <th
                                                    className="p-4 text-left cursor-pointer hover:bg-[#bf953f]/10 transition-colors"
                                                    onClick={() => handleSort('duration')}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-semibold text-[#C0C0C0]">Duration</span>
                                                        <SortIcon field="duration" />
                                                    </div>
                                                </th>
                                                <th
                                                    className="p-4 text-left cursor-pointer hover:bg-[#bf953f]/10 transition-colors"
                                                    onClick={() => handleSort('price')}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-semibold text-[#C0C0C0]">Price</span>
                                                        <SortIcon field="price" />
                                                    </div>
                                                </th>
                                                <th className="p-4 text-left">
                                                    <span className="font-semibold text-[#C0C0C0]">Old Price</span>
                                                </th>
                                                <th className="p-4 text-left">
                                                    <span className="font-semibold text-[#C0C0C0]">Savings</span>
                                                </th>
                                                <th
                                                    className="p-4 text-left cursor-pointer hover:bg-[#bf953f]/10 transition-colors"
                                                    onClick={() => handleSort('isBestValue')}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-semibold text-[#C0C0C0]">Best Value</span>
                                                        <SortIcon field="isBestValue" />
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPlans.map((plan, index) => (
                                                <motion.tr
                                                    key={plan._id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="border-b border-[#bf953f]/10 last:border-0 hover:bg-[#bf953f]/5 transition-colors"
                                                >
                                                    <td className="p-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPlans.includes(plan._id!)}
                                                            onChange={() => togglePlanSelection(plan._id!)}
                                                            className="w-4 h-4 text-[#bf953f] bg-[#1e1e1e] border-[#bf953f] rounded focus:ring-[#bf953f]"
                                                        />
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center space-x-3">
                                                            <span className="text-[#C0C0C0] font-medium">{plan.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="text-[#C0C0C0]">{plan.duration}</span>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="text-[#4ade80] font-bold">${plan.price}</span>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="text-[#f87171] line-through">
                                                            {plan.oldPrice ? `$${plan.oldPrice}` : '-'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        {plan.oldPrice && Number(plan.oldPrice) > Number(plan.price) ? (
                                                            <span className="text-[#4ade80] font-bold">
                                                                ${Number(plan.oldPrice) - Number(plan.price)} ({calculateSavings(Number(plan.oldPrice), Number(plan.price))}%)
                                                            </span>
                                                        ) : (
                                                            <span className="text-[#C0C0C0]/50">-</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        {plan.isBestValue ? (
                                                            <div className="flex items-center space-x-2">
                                                                <Crown className="w-4 h-4 text-[#bf953f]" />
                                                                <span className="text-[#bf953f] font-medium">Yes</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[#C0C0C0]/50">No</span>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanConfigurationPage;