import { Plus } from "lucide-react";
import React from "react";

type Props = {
    heading: string;
    subHeading: string;
    showButton?: boolean;
    buttonText?: string;
    onButtonClick?: () => void;
    buttonIcon?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
};

const Heading = ({
    heading,
    subHeading,
    showButton = false,
    buttonText = "Action",
    onButtonClick,
    className,
    children,
}: Props) => {
    return (
        <div
            className={`flex flex-row gap-4 justify-between items-start ${className}`}
        >
            <div className="pb-4">
                <h2 className="text-lg text-text-heading font-sm">{heading}</h2>
                <h2 className="text-sm text-text-heading">{subHeading}</h2>
            </div>

            <div className="flex items-center gap-2">
                {children}
                {showButton && (
                    <button
                        onClick={onButtonClick}
                        className="flex flex-row items-center gap-1 text-primary bg-gold-500 text-body4 px-3.5 py-1.5 rounded-md hover:bg-orange-400/90 transition cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Heading;
