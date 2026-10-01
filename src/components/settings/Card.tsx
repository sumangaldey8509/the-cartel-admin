import { ReactNode } from "react"

interface CardProps {
    children: ReactNode
    className?: string
    onClick?: () => void
}

export const Card = ({ children, className = "", onClick }: CardProps) => {
    return (
        <div
            className={`
        bg-[#212121]
        rounded-lg 
        border border-gray-800
        transition-all duration-200
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </div>
    )
}