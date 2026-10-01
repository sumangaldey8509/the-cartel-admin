import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

// Reusable Pagination Component
interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    totalItems: number
    itemsPerPage: number
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage
}) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mt-6">
            <div className="text-[#C0C0C0] text-sm">
                Showing {startItem}-{endItem} of {totalItems} coins
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#444] transition-colors"
                >
                    <ChevronsLeft size={16} />
                </button>

                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#444] transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                        return pageNum <= totalPages ? (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`w-8 h-8 rounded-lg text-sm transition-colors ${currentPage === pageNum
                                    ? 'bg-[#bf953f] text-white'
                                    : 'bg-[#333] text-[#C0C0C0] hover:bg-[#444]'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        ) : null
                    })}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#444] transition-colors"
                >
                    <ChevronRight size={16} />
                </button>

                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#444] transition-colors"
                >
                    <ChevronsRight size={16} />
                </button>
            </div>
        </div>
    )
}


export default Pagination