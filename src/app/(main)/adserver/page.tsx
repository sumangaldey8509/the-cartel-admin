"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Heading from "@/components/common/heading/heading";
import {
    Search,
    Filter,
    Trash2,
    Copy,
    Edit,
    Play,
    Pause,
    Eye,
    TrendingUp,
    Calendar,
    MousePointerClick,
    DollarSign,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";

// Types
interface Ad {
    headline: string;
    url: string;
}

interface AdGroup {
    name: string;
    ads: Ad[];
}

interface Campaign {
    id: string;
    name: string;
    advertiser: string;
    objective: "Traffic" | "Awareness" | "Conversions";
    budget: string;
    bid: string;
    geo: string;
    device: "All Devices" | "Mobile" | "Desktop";
    publishers: string[];
    creatives: { name?: string; url?: string }[];
    adGroups: AdGroup[];
    status: "active" | "paused" | "completed" | "draft";
    impressions: number;
    clicks: number;
    spend: number;
    startDate: string;
    endDate?: string;
    createdAt: string;
}

// Dummy Data
let initialCampaigns: Campaign[] = [
    {
        id: "1",
        name: "Product Launch - USA",
        advertiser: "Sam Digital Solutions",
        objective: "Traffic",
        budget: "20000",
        bid: "20",
        geo: "London",
        device: "All Devices",
        publishers: ["Times of India", "ESPN"],
        creatives: [{ name: "hero-banner.jpg" }],
        adGroups: [
            {
                name: "Default Ad Group",
                ads: [{ headline: "Trader Chatbot", url: "https://thecartel.ai" }],
            },
        ],
        status: "active",
        impressions: 125430,
        clicks: 3480,
        spend: 12450,
        startDate: "2025-03-01",
        createdAt: "2025-02-28",
    },
    {
        id: "2",
        name: "Brand Awareness - India",
        advertiser: "Global Media Inc",
        objective: "Awareness",
        budget: "50000",
        bid: "15",
        geo: "Mumbai, Delhi, Bangalore",
        device: "Mobile",
        publishers: ["NDTV", "Times of India"],
        creatives: [{ name: "awareness-video.mp4" }],
        adGroups: [
            {
                name: "Video Ads",
                ads: [{ headline: "Discover More", url: "https://example.com/brand" }],
            },
        ],
        status: "active",
        impressions: 890000,
        clicks: 12500,
        spend: 34200,
        startDate: "2025-02-15",
        createdAt: "2025-02-10",
    },
    {
        id: "3",
        name: "TechCrunch Retargeting",
        advertiser: "StartupBoost",
        objective: "Conversions",
        budget: "15000",
        bid: "35",
        geo: "USA, Canada",
        device: "Desktop",
        publishers: ["TechCrunch", "CoinDesk"],
        creatives: [{ name: "retargeting-300x250.png" }],
        adGroups: [
            {
                name: "High Intent",
                ads: [{ headline: "Get 20% Off", url: "https://startupboost.com/offer" }],
            },
        ],
        status: "paused",
        impressions: 45000,
        clicks: 2100,
        spend: 8900,
        startDate: "2025-03-10",
        createdAt: "2025-03-05",
    },
    {
        id: "4",
        name: "ESPN Summer Campaign",
        advertiser: "Sporty Brands",
        objective: "Traffic",
        budget: "75000",
        bid: "12",
        geo: "UK, Australia",
        device: "All Devices",
        publishers: ["ESPN"],
        creatives: [{ name: "summer-banner.gif" }],
        adGroups: [
            {
                name: "Sports Fans",
                ads: [{ headline: "Summer Sale", url: "https://sporty.com/sale" }],
            },
        ],
        status: "active",
        impressions: 310000,
        clicks: 9800,
        spend: 28100,
        startDate: "2025-04-01",
        createdAt: "2025-03-20",
    },
    {
        id: "5",
        name: "Weekend Flash Sale",
        advertiser: "Ecom Retail",
        objective: "Conversions",
        budget: "8000",
        bid: "25",
        geo: "New York, Los Angeles",
        device: "Mobile",
        publishers: ["YourSite A", "YourSite B"],
        creatives: [{ name: "flash-sale.jpg" }],
        adGroups: [
            {
                name: "Deal Seekers",
                ads: [{ headline: "60% Off Today Only", url: "https://ecom.com/flash" }],
            },
        ],
        status: "completed",
        impressions: 120000,
        clicks: 4500,
        spend: 8000,
        startDate: "2025-03-25",
        endDate: "2025-03-27",
        createdAt: "2025-03-24",
    },
];

export default function AdServerManagement() {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | Campaign["status"]>("all");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"card" | "table">("card");

    // Derived stats
    const stats = useMemo(() => {
        const active = campaigns.filter((c) => c.status === "active").length;
        const paused = campaigns.filter((c) => c.status === "paused").length;
        const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
        const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
        const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
        const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0";
        return { active, paused, totalSpend, totalClicks, totalImpressions, avgCTR };
    }, [campaigns]);

    // Filter campaigns
    const filteredCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => {
            const matchesSearch =
                campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                campaign.advertiser.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [campaigns, searchTerm, statusFilter]);

    // Actions
    const handleDelete = (id: string) => {
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
        setShowDeleteConfirm(null);
    };

    const handleDuplicate = (campaign: Campaign) => {
        const newCampaign: Campaign = {
            ...campaign,
            id: Date.now().toString(),
            name: `Copy of ${campaign.name}`,
            status: "draft",
            impressions: 0,
            clicks: 0,
            spend: 0,
            createdAt: new Date().toISOString().split("T")[0],
        };
        setCampaigns((prev) => [...prev, newCampaign]);
    };

    const handleToggleStatus = (id: string, currentStatus: Campaign["status"]) => {
        if (currentStatus === "completed") return;
        const newStatus = currentStatus === "active" ? "paused" : "active";
        setCampaigns((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
    };

    const handleEdit = (id: string) => {
        // Navigate to edit page; you can pass campaign data via query or state
        router.push(`/adserver/manage-campeign?edit=${id}`);
    };

    // Helper: status badge component
    const StatusBadge = ({ status }: { status: Campaign["status"] }) => {
        const config = {
            active: { icon: Play, label: "Active", className: "bg-green-500/20 text-green-400 border-green-500/30" },
            paused: { icon: Pause, label: "Paused", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
            completed: { icon: CheckCircle, label: "Completed", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
            draft: { icon: AlertCircle, label: "Draft", className: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
        };
        const { icon: Icon, label, className } = config[status];
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
                <Icon className="w-3 h-3" />
                {label}
            </span>
        );
    };

    // Metric Card
    const MetricCard = ({ title, value, icon: Icon, trend }: any) => (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-sm">{title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{value}</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/20 text-amber-400">
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            {trend && <p className="text-xs text-green-400 mt-2">{trend}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-transparent p-4">
            <div className="mx-auto">
                <Heading
                    heading="Ad Server Management"
                    subHeading="Manage advertisement campaigns, placement, and server configurations"
                    showButton={true}
                    buttonText="New Campaign"
                    onButtonClick={() => router.push("/adserver/manage-campeign")}
                />

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
                    <MetricCard title="Total Campaigns" value={campaigns.length} icon={TrendingUp} />
                    <MetricCard title="Active" value={stats.active} icon={Play} />
                    <MetricCard title="Total Spend" value={`$${stats.totalSpend.toLocaleString()}`} icon={DollarSign} />
                    <MetricCard title="Total Clicks" value={stats.totalClicks.toLocaleString()} icon={MousePointerClick} />
                    <MetricCard title="Avg. CTR" value={`${stats.avgCTR}%`} icon={Eye} />
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mt-8 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by campaign or advertiser..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/50 border border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 bg-slate-900/50 rounded-xl border border-white/10 p-1">
                            {["all", "active", "paused", "completed", "draft"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status as any)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${statusFilter === status
                                        ? "bg-amber-500 text-black"
                                        : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
                            className="px-4 py-2 rounded-xl bg-slate-900/50 border border-white/10 text-gray-300 hover:bg-white/10 transition"
                        >
                            {viewMode === "card" ? "Table View" : "Card View"}
                        </button>
                    </div>
                </div>

                {/* Campaign List */}
                {filteredCampaigns.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-gray-400">No campaigns found. Create your first campaign!</p>
                    </div>
                ) : viewMode === "card" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCampaigns.map((campaign) => (
                            <div
                                key={campaign.id}
                                className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10 p-5"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{campaign.name}</h3>
                                        <p className="text-sm text-gray-400">{campaign.advertiser}</p>
                                    </div>
                                    <StatusBadge status={campaign.status} />
                                </div>

                                {/* Metrics */}
                                <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-white/10">
                                    <div>
                                        <p className="text-xs text-gray-500">Impressions</p>
                                        <p className="text-sm font-semibold text-white">{campaign.impressions.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Clicks</p>
                                        <p className="text-sm font-semibold text-white">{campaign.clicks.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">CTR</p>
                                        <p className="text-sm font-semibold text-white">
                                            {((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%
                                        </p>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-1 text-xs text-gray-400 mb-4">
                                    <div className="flex justify-between">
                                        <span>Budget:</span>
                                        <span className="text-white">${parseInt(campaign.budget).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Spent:</span>
                                        <span className="text-amber-400">${campaign.spend.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Location:</span>
                                        <span className="text-white truncate max-w-[150px]">{campaign.geo}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-white/10">
                                    <button
                                        onClick={() => handleToggleStatus(campaign.id, campaign.status)}
                                        disabled={campaign.status === "completed"}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition ${campaign.status === "active"
                                            ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                                            : campaign.status === "paused"
                                                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                                : "bg-gray-500/10 text-gray-500 cursor-not-allowed"
                                            }`}
                                    >
                                        {campaign.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                        {campaign.status === "active" ? "Pause" : campaign.status === "paused" ? "Activate" : "Locked"}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(campaign.id)}
                                        className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDuplicate(campaign)}
                                        className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(campaign.id)}
                                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Delete Confirmation Modal */}
                                {showDeleteConfirm === campaign.id && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                                        <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full mx-4 border border-white/10">
                                            <h3 className="text-xl font-semibold text-white mb-2">Delete Campaign</h3>
                                            <p className="text-gray-400 mb-6">
                                                Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
                                            </p>
                                            <div className="flex gap-3 justify-end">
                                                <button
                                                    onClick={() => setShowDeleteConfirm(null)}
                                                    className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(campaign.id)}
                                                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    // Table View
                    <div className="overflow-x-auto bg-white/5 rounded-2xl border border-white/10">
                        <table className="w-full text-sm">
                            <thead className="border-b border-white/10 bg-white/5">
                                <tr>
                                    <th className="text-left p-4 font-semibold text-gray-300">Campaign</th>
                                    <th className="text-left p-4 font-semibold text-gray-300">Status</th>
                                    <th className="text-left p-4 font-semibold text-gray-300">Impressions</th>
                                    <th className="text-left p-4 font-semibold text-gray-300">Clicks</th>
                                    <th className="text-left p-4 font-semibold text-gray-300">CTR</th>
                                    <th className="text-left p-4 font-semibold text-gray-300">Budget/Spend</th>
                                    <th className="text-left p-4 font-semibold text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredCampaigns.map((campaign) => (
                                    <tr key={campaign.id} className="hover:bg-white/5 transition">
                                        <td className="p-4">
                                            <div>
                                                <p className="font-medium text-white">{campaign.name}</p>
                                                <p className="text-xs text-gray-400">{campaign.advertiser}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={campaign.status} />
                                        </td>
                                        <td className="p-4 text-white">{campaign.impressions.toLocaleString()}</td>
                                        <td className="p-4 text-white">{campaign.clicks.toLocaleString()}</td>
                                        <td className="p-4 text-white">
                                            {((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%
                                        </td>
                                        <td className="p-4">
                                            <div className="text-white">${parseInt(campaign.budget).toLocaleString()}</div>
                                            <div className="text-xs text-amber-400">Spent: ${campaign.spend.toLocaleString()}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(campaign.id, campaign.status)}
                                                    className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 transition"
                                                    title={campaign.status === "active" ? "Pause" : "Activate"}
                                                >
                                                    {campaign.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                </button>
                                                <button onClick={() => handleEdit(campaign.id)} className="p-1.5 rounded bg-blue-500/20 hover:bg-blue-500/30">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDuplicate(campaign)} className="p-1.5 rounded bg-purple-500/20 hover:bg-purple-500/30">
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setShowDeleteConfirm(campaign.id)} className="p-1.5 rounded bg-red-500/20 hover:bg-red-500/30">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}