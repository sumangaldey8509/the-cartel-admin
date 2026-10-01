import { CampaignForm, Objective } from "@/interface/adServer";

interface Props {
    form: CampaignForm;
    updateField: <K extends keyof CampaignForm>(key: K, value: CampaignForm[K]) => void;
}

export default function BasicInfoStep({ form, updateField }: Props) {
    return (
        <div className="space-y-6">
            <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name *</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="e.g., Q4 Product Launch - US"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-[#bf953f] focus:ring-1 focus:ring-[#bf953f] outline-none transition-all text-white placeholder:text-gray-500"
                />
            </div>

            <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Advertiser *</label>
                <input
                    type="text"
                    value={form.advertiser}
                    onChange={(e) => updateField("advertiser", e.target.value)}
                    placeholder="Brand or agency name"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-[#bf953f] focus:ring-1 focus:ring-[#bf953f] outline-none transition-all text-white placeholder:text-gray-500"
                />
            </div>

            <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Objective *</label>
                <div className="grid grid-cols-3 gap-3">
                    {(["Traffic", "Awareness", "Conversions"] as Objective[]).map((obj) => (
                        <button
                            key={obj}
                            onClick={() => updateField("objective", obj)}
                            className={`px-4 py-3 rounded-xl font-medium transition-all ${form.objective === obj
                                ? "bg-gradient-to-r from-[#bf953f]/80 to-[#bf953f] text-white shadow-lg"
                                : "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-white/5"
                                }`}
                        >
                            {obj}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}