import { Lightbulb, TrendingUp, Target, DollarSign, Globe, Image, Layers, CheckCircle } from "lucide-react";

interface Props {
    step: number;
    stepName: string;
    tip: string;
}

const stepIcons = [
    <TrendingUp key="0" className="w-5 h-5" />,
    <DollarSign key="1" className="w-5 h-5" />,
    <Target key="2" className="w-5 h-5" />,
    <Globe key="3" className="w-5 h-5" />,
    <Image key="4" className="w-5 h-5" />,
    <Layers key="5" className="w-5 h-5" />,
    <CheckCircle key="6" className="w-5 h-5" />,
];

export default function GuidancePanel({ step, stepName, tip }: Props) {
    return (
        <div className="sticky top-8 bg-gradient-to-br from-background/50 to-background/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">{stepIcons[step]}</div>
                <h3 className="font-semibold text-white">{stepName}</h3>
            </div>

            <div className="flex gap-3 mb-6">
                <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300 leading-relaxed">{tip}</p>
            </div>

            <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pro Tips</p>
                <ul className="space-y-2 text-xs text-gray-400">
                    {step === 0 && (
                        <>
                            <li>• Use clear, descriptive campaign names (e.g., "US - Brand Awareness - Q4")</li>
                            <li>• Match objective to your funnel stage: Traffic for top, Conversions for bottom</li>
                        </>
                    )}
                    {step === 1 && (
                        <>
                            <li>• Start with a daily budget 2-3x your bid amount for sufficient data</li>
                            <li>• Higher bids win more auctions – test 10-20% above recommended</li>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <li>• Layer location with device for precise targeting (e.g., Mobile in NYC)</li>
                            <li>• Exclude low-performing regions early to optimize spend</li>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <li>• Select 3-5 highly relevant publishers rather than 10 mediocre ones</li>
                            <li>• Review each publisher's audience demographics before adding</li>
                        </>
                    )}
                    {step === 4 && (
                        <>
                            <li>• Image dimensions: 1200x628 for social, 300x250 for display</li>
                            <li>• Keep file sizes under 500KB for fast loading</li>
                            <li>• Upload 3-5 variations for A/B testing</li>
                        </>
                    )}
                    {step === 5 && (
                        <>
                            <li>• Group ads by theme or audience for better organization</li>
                            <li>• Each ad group should have 3-5 ads for optimization</li>
                            <li>• Use clear, action-oriented headlines</li>
                        </>
                    )}
                    {step === 6 && (
                        <>
                            <li>• Double-check budget caps and targeting exclusions</li>
                            <li>• Ensure all URLs are working and use UTM parameters</li>
                            <li>• Start with a small budget for initial testing</li>
                        </>
                    )}
                </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Need help? Contact support
                </div>
            </div>
        </div>
    );
}