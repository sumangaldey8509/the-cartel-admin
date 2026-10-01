import { AdGroup, CampaignForm } from "@/interface/adServer";
import { Plus, Trash2 } from "lucide-react";

interface Props {
    form: CampaignForm;
    updateField: <K extends keyof CampaignForm>(key: K, value: CampaignForm[K]) => void;
}

export default function AdGroupsStep({ form, updateField }: Props) {
    const addAdGroup = () => {
        updateField("adGroups", [
            ...form.adGroups,
            { name: "New Ad Group", ads: [{ headline: "", url: "" }] },
        ]);
    };

    const updateAdGroup = (index: number, updatedGroup: AdGroup) => {
        const newGroups = [...form.adGroups];
        newGroups[index] = updatedGroup;
        updateField("adGroups", newGroups);
    };

    const addAd = (groupIndex: number) => {
        const group = form.adGroups[groupIndex];
        const updated = { ...group, ads: [...group.ads, { headline: "", url: "" }] };
        updateAdGroup(groupIndex, updated);
    };

    const updateAd = (groupIndex: number, adIndex: number, field: "headline" | "url", value: string) => {
        const group = form.adGroups[groupIndex];
        const newAds = [...group.ads];
        newAds[adIndex] = { ...newAds[adIndex], [field]: value };
        updateAdGroup(groupIndex, { ...group, ads: newAds });
    };

    return (
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {form.adGroups.map((group, gIdx) => (
                <div key={gIdx} className="rounded-xl border border-white/10 bg-background/30 p-5">
                    <div className="flex justify-between items-center mb-4">
                        <input
                            value={group.name}
                            onChange={(e) => updateAdGroup(gIdx, { ...group, name: e.target.value })}
                            className="text-lg font-semibold bg-transparent border-b border-white/20 focus:border-[#bf953f] outline-none px-2 py-1 text-white"
                            placeholder="Ad Group Name"
                        />
                        {form.adGroups.length > 1 && (
                            <button
                                onClick={() => {
                                    const newGroups = form.adGroups.filter((_, i) => i !== gIdx);
                                    updateField("adGroups", newGroups);
                                }}
                                className="text-red-400 hover:text-red-300 transition"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {group.ads.map((ad, aIdx) => (
                            <div key={aIdx} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg bg-background/50">
                                <input
                                    value={ad.headline}
                                    onChange={(e) => updateAd(gIdx, aIdx, "headline", e.target.value)}
                                    placeholder="Ad Headline"
                                    className="px-3 py-2 rounded-lg bg-background border border-white/10 focus:border-[#bf953f] outline-none text-white"
                                />
                                <input
                                    value={ad.url}
                                    onChange={(e) => updateAd(gIdx, aIdx, "url", e.target.value)}
                                    placeholder="Destination URL"
                                    className="px-3 py-2 rounded-lg bg-background border border-white/10 focus:border-[#bf953f] outline-none text-white"
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => addAd(gIdx)}
                        className="mt-3 text-sm text-[#bf953f]/80 hover:text-[#bf953f] flex items-center gap-1"
                    >
                        <Plus className="w-4 h-4" /> Add Ad
                    </button>
                </div>
            ))}

            <button
                onClick={addAdGroup}
                className="w-full py-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-[#bf953f] transition"
            >
                + Add Ad Group
            </button>
        </div>
    );
}