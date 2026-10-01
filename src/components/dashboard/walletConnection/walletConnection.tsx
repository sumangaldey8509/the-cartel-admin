"use client"

import appClient from '@/lib/appClient';
import { AxiosError } from 'axios';
import { useState, useEffect } from 'react';

interface WalletData {
    address: string;
    connections: number;
    firstConnectedAt: string;
    lastConnectedAt: string;
    walletType: string;
    __v: number;
}

const WalletConnectionsDashboard = () => {
    const [data, setData] = useState<WalletData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const search = ""
    const page = "1"
    const limit = "10"

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await appClient.get("/api/wallet/get", {
                    params: { search, page, limit },
                });


                if (res.data.statusCode === 200) {
                    setData(res.data.wallets.docs);
                } else {
                    setError(res.data.message);
                    setData([]);
                }
            } catch (err: unknown) {
                if (err instanceof AxiosError) {
                    // Safe access because we narrowed it to AxiosError
                    setError(err.response?.data?.error ?? "Wallet fetching failed.");
                    console.error("API Error:", err.message);
                } else if (err instanceof Error) {
                    // Fallback for normal JS errors
                    setError(err.message);
                    console.error("Unexpected Error:", err.message);
                } else {
                    // Fallback for completely unknown values
                    setError("An unknown error occurred.");
                    console.error("Unknown Error:", err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [search, page, limit]);


    const formatDate = (dateString: string) => {

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block relative w-12 h-12">
                        <div className="absolute inset-0 border-4 border-[#bf953f] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-4 text-text-heading">Loading wallet connections...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center p-6 bg-[#121212] rounded-lg border border-[#8B0000] max-w-md">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#8B0000] flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Error Loading Data</h3>
                    <p className="text-text-heading mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-[#8B0000] text-white rounded-md hover:bg-[#700000] transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center p-6 bg-[#121212] rounded-lg border border-[#333] max-w-md">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#333] flex items-center justify-center">
                        <svg className="w-8 h-8 text-text-heading" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No Wallet Connections</h3>
                    <p className="text-text-heading">No wallet connections have been recorded yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0A0A0A] rounded-lg border border-[#333] overflow-hidden">

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#121212]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-heading uppercase tracking-wider">
                                Wallet Address
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-heading uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-heading uppercase tracking-wider">
                                Connections
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-heading uppercase tracking-wider">
                                First Connected
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-heading uppercase tracking-wider">
                                Last Active
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333]">
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-[#121212] transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-[#bf953f] bg-opacity-10 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-[#1e1e1e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-white">
                                                {shortenAddress(item.address)}
                                            </div>
                                            <div className="text-sm text-text-heading">
                                                {item.address}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-medium bg-[#bf953f] bg-opacity-20 text-[#1e1e1e] rounded-full">
                                        {item.walletType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-text-heading">{item.connections}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-heading">
                                    {formatDate(item.firstConnectedAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-heading">
                                    {formatDate(item.lastConnectedAt)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WalletConnectionsDashboard;