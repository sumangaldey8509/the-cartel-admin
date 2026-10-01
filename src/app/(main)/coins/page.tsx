"use client"

import Heading from "@/components/common/heading/heading"
import { Coin } from "@/interface/coins"
import appClient from "@/lib/appClient"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Edit, Trash2, Filter, MoreHorizontal, CheckSquare, Square, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Rocket } from "lucide-react"
import CoinTable from "@/components/coins/CoinTable"
import Pagination from "@/components/common/paginatoin/pagination"
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message"
import EditCoinModal from "@/components/coins/EditCoinModal"

const Dashboard = () => {
    const [status, setStatus] = useState<"upcoming" | "launched">("upcoming")
    const [data, setData] = useState<Coin[]>([])
    const [page, setPage] = useState(1)
    const [totalDocs, setTotalDocs] = useState(0)
    const [limit, setLimit] = useState(10)
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleAddCoinButtonClick = () => {
        router.replace("/coins/add-coins")
    }

    const handleGetCoins = useCallback(async () => {
        setLoading(true)
        try {
            const res = await appClient.get("/api/coins/get", {
                params: { status, page, limit }
            })

            if (res.data.status) {
                setData(res.data.coins.docs)
                setTotalDocs(res.data.coins.totalDocs)
            }
        } catch (error) {
            console.log("getting error while get coin list", error)
        } finally {
            setLoading(false)
        }
    }, [status, page, limit])

    useEffect(() => {
        handleGetCoins()
    }, [handleGetCoins])

    const handleSelectRow = (id: string) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        )
    }

    const handleSelectAll = () => {
        setSelectedRows(prev =>
            prev.length === data.length ? [] : data.map(coin => coin._id)
        )
    }

    const handleEdit = (coin: Coin) => {
        console.log("Edit coin:", coin)
        // Implement edit functionality
        setSelectedCoin(coin)
        setIsEditModalOpen(true)
    }


    // Function to refresh data after update
    const handleUpdateSuccess = () => {
        handleGetCoins()
    };

    const handleDelete = async (payload: string[]) => {
        console.log("Delete coin:", payload)
        // Implement delete functionality

        if (!payload) return;

        const toastId = toastLoading("Deleting Coin(s)", {
            description: `Removing ${payload.length}(s) coin from the system`
        })

        try {
            const res = await appClient.delete("/api/coins/delete", {
                params: { ids: JSON.stringify(payload) }
            })
            console.log({ res })

            if (res.data.status) {
                toastUpdate(toastId, "success", "Coin Delete", {
                    description: res.data.message
                })
                handleGetCoins()
            }

        } catch (error) {
            console.log("getting error while deleing coins", error)
        }
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        setSelectedRows([]) // Clear selection on page change
    }

    const totalPages = Math.ceil(totalDocs / limit)

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a] p-4">
            <div className="mx-auto">
                <Heading
                    heading="Launchpad Admin"
                    subHeading="Manage all coin launches — create, edit, and monitor coins with real-time status."
                    showButton={true}
                    buttonText="Launch New Coin"
                    onButtonClick={handleAddCoinButtonClick}
                />

                {/* Tabs */}
                <div className="flex mt-6 space-x-0 bg-[#121212] rounded-lg border border-[#333] w-fit overflow-hidden">
                    <button
                        onClick={() => {
                            setStatus("upcoming")
                            setPage(1)
                            setSelectedRows([])
                        }}
                        className={`px-6 py-3 font-medium transition-all duration-300 relative group ${status === "upcoming"
                            ? 'bg-gradient-to-r from-[#bf953f]/10 to-transparent text-[#bf953f] border-r border-[#aa771c]/50'
                            : 'text-[#C0C0C0] hover:text-[#bf953f] hover:bg-[#bf953f]/5'
                            }`}
                    >
                        <span className="relative z-10 flex items-center">
                            <Rocket size={16} className="mr-2" />
                            Upcoming
                        </span>
                        {status === "upcoming" && (
                            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#bf953f] to-[#aa771c]"></div>
                        )}
                    </button>

                    <div className="w-px bg-[#333] my-2"></div>

                    <button
                        onClick={() => {
                            setStatus("launched")
                            setPage(1)
                            setSelectedRows([])
                        }}
                        className={`px-6 py-3 font-medium transition-all duration-300 relative group ${status === "launched"
                            ? 'bg-gradient-to-r from-transparent to-[#8B0000]/10 text-[#8B0000] border-l border-[#700000]/50'
                            : 'text-[#C0C0C0] hover:text-[#8B0000] hover:bg-[#8B0000]/5'
                            }`}
                    >
                        <span className="relative z-10 flex items-center">
                            <CheckSquare size={16} className="mr-2" />
                            Launched
                        </span>
                        {status === "launched" && (
                            <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-[#8B0000] to-[#700000]"></div>
                        )}
                    </button>
                </div>

                {/* Selected Actions */}
                {selectedRows.length > 0 && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-[#bf953f]/10 to-[#8B0000]/10 rounded-lg border border-[#bf953f]/30 flex items-center justify-between">
                        <div className="text-[#bf953f] text-sm">
                            {selectedRows.length} coin{selectedRows.length !== 1 ? 's' : ''} selected
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => handleDelete(selectedRows)} className="px-3 py-1 bg-red-600 text-text-heading rounded text-sm hover:bg-red-700 transition-colors">
                                Delete Selected
                            </button>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="mt-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#bf953f] mx-auto"></div>
                            <div className="text-[#C0C0C0] text-sm mt-2">Loading coins...</div>
                        </div>
                    ) : (
                        <>
                            <CoinTable
                                data={data}
                                selectedRows={selectedRows}
                                onSelectRow={handleSelectRow}
                                onSelectAll={handleSelectAll}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />

                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    totalItems={totalDocs}
                                    itemsPerPage={limit}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
            <EditCoinModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                coinData={selectedCoin}
                onUpdateSuccess={handleUpdateSuccess}
            />
        </div>
    )
}

export default Dashboard