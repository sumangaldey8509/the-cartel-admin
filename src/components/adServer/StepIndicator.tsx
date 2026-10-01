import { Check } from "lucide-react";

interface Props {
    steps: string[];
    currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: Props) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${idx < currentStep
                                ? "bg-[#bf953f] text-white"
                                : idx === currentStep
                                    ? "bg-[#bf953f] text-white ring-4 ring-[#bf953f]/30"
                                    : "bg-slate-700 text-gray-400"
                                }`}
                        >
                            {idx < currentStep ? <Check className="w-5 h-5" /> : idx + 1}
                        </div>
                        <div className="text-xs text-gray-400 mt-2 hidden sm:block">{step}</div>
                    </div>
                ))}
            </div>
            <div className="relative mt-4">
                <div className="absolute top-1/2 h-0.5 bg-slate-700 w-full -translate-y-1/2" />
                <div
                    className="absolute top-1/2 h-0.5 bg-gradient-to-r from-[#bf953f] to-amber-400 transition-all duration-300 -translate-y-1/2"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />
            </div>
        </div>
    );
}