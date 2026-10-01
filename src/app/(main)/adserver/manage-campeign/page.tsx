"use client";

import { useState, JSX } from "react";
import Heading from "@/components/common/heading/heading";

import { CampaignForm } from "@/interface/adServer";
import StepIndicator from "@/components/adServer/StepIndicator";
import BasicInfoStep from "@/components/adServer/campeign/steps/BasicInfoStep";
import BudgetStep from "@/components/adServer/campeign/steps/BudgetStep";
import TargetingStep from "@/components/adServer/campeign/steps/TargetingStep";
import PublishersStep from "@/components/adServer/campeign/steps/PublishersStep";
import CreativesStep from "@/components/adServer/campeign/steps/CreativesStep";
import AdGroupsStep from "@/components/adServer/campeign/steps/AdGroupsStep";
import ReviewStep from "@/components/adServer/campeign/steps/ReviewStep";
import GuidancePanel from "@/components/adServer/GuidancePanel";

const steps: string[] = [
    "Basic Info",
    "Budget",
    "Targeting",
    "Publishers",
    "Creatives",
    "Ad Groups",
    "Review",
];

const stepTips: Record<number, string> = {
    0: "Define campaign identity and primary goal. Choose an objective that aligns with your business KPIs.",
    1: "Set a realistic daily/total budget and competitive bid amount based on your target audience value.",
    2: "Target specific locations and devices to reach your most valuable audience segments.",
    3: "Select premium publishers relevant to your niche. Quality over quantity yields better ROI.",
    4: "Upload high-resolution creatives. Ensure they comply with platform guidelines and A/B test variations.",
    5: "Organize ads into logical groups. Each group should target a specific theme or audience segment.",
    6: "Double-check all settings before launching. Review budget caps and targeting exclusions.",
};

export default function ManageCampaign(): JSX.Element {
    const [step, setStep] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const [form, setForm] = useState<CampaignForm>({
        name: "",
        advertiser: "",
        objective: "Traffic",
        budget: "",
        bid: "",
        geo: "",
        device: "All Devices",
        publishers: [],
        creatives: [],
        adGroups: [
            {
                name: "Default Ad Group",
                ads: [{ headline: "", url: "" }],
            },
        ],
    });

    const validateStep = (): boolean => {
        switch (step) {
            case 0:
                return !!form.name && !!form.advertiser;
            case 1:
                return !!form.budget && !!form.bid && parseFloat(form.budget) > 0 && parseFloat(form.bid) > 0;
            case 2:
                return !!form.geo;
            case 3:
                return form.publishers.length > 0;
            case 4:
                return form.creatives.length > 0;
            case 5:
                return form.adGroups.every(
                    (group) =>
                        group.name &&
                        group.ads.length > 0 &&
                        group.ads.every((ad) => ad.headline && ad.url)
                );
            default:
                return true;
        }
    };

    const handleNext = (): void => {
        if (!validateStep()) {
            // Show validation error via toast or inline message
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (step === steps.length - 1) {
                // Launch campaign
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                console.log("Campaign launched:", form);
            } else {
                setStep((prev) => prev + 1);
            }
        }, 500);
    };

    const handleBack = (): void => setStep((prev) => prev - 1);

    const updateField = <K extends keyof CampaignForm>(key: K, value: CampaignForm[K]): void => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-transparent p-4">
            <div className="mx-auto">
                <Heading
                    heading="Campaign Management"
                    subHeading={showSuccess ? "Campaign launched successfully!" : "Create New Campaign"}
                    showButton={false}
                />

                <div className="flex flex-col xl:flex-row gap-8 mt-8">
                    {/* Main Form Column */}
                    <div className="flex-1 min-w-0">
                        <StepIndicator steps={steps} currentStep={step} />

                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl p-6 md:p-8 transition-all duration-300">
                            {step === 0 && <BasicInfoStep form={form} updateField={updateField} />}
                            {step === 1 && <BudgetStep form={form} updateField={updateField} />}
                            {step === 2 && <TargetingStep form={form} updateField={updateField} />}
                            {step === 3 && <PublishersStep form={form} updateField={updateField} />}
                            {step === 4 && <CreativesStep form={form} updateField={updateField} />}
                            {step === 5 && <AdGroupsStep form={form} updateField={updateField} />}
                            {step === 6 && <ReviewStep form={form} />}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-10 pt-6 border-t border-white/10">
                                {step > 0 && (
                                    <button
                                        onClick={handleBack}
                                        className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition-all duration-200 border border-white/10"
                                    >
                                        ← Back
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    disabled={loading}
                                    className={`px-8 py-2.5 rounded-xl font-semibold transition-all duration-200 ml-auto ${loading
                                        ? "bg-[#bf953f]/50 cursor-not-allowed"
                                        : "bg-gradient-to-r from-[#bf953f] to-[#bf953f] hover:from-[#bf953f]/70 hover:to-[#bf953f] shadow-lg hover:shadow-[#bf953f]/25"
                                        } text-white`}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </div>
                                    ) : step === steps.length - 1 ? (
                                        "🚀 Launch Campaign"
                                    ) : (
                                        "Next →"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Guidance Panel */}
                    <div className="xl:w-80">
                        <GuidancePanel step={step} stepName={steps[step]} tip={stepTips[step]} />
                    </div>
                </div>
            </div>
        </div>
    );
}