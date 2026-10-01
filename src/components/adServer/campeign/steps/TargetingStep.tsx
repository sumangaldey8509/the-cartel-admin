import { CampaignForm, Device } from "@/interface/adServer";

interface Props {
    form: CampaignForm;
    updateField: <K extends keyof CampaignForm>(key: K, value: CampaignForm[K]) => void;
}

export default function TargetingStep({ form, updateField }: Props) {
    const devices: Device[] = ["All Devices", "Mobile", "Desktop"];

    return (
        <div className="space-y-6">
            <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Target Location *</label>
                <input
                    type="text"
                    value={form.geo}
                    onChange={(e) => updateField("geo", e.target.value)}
                    placeholder="Countries, cities, or regions (e.g., USA, London)"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-white placeholder:text-gray-500"
                />
            </div>

            <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Device Targeting</label>
                <div className="grid grid-cols-3 gap-3">
                    {devices.map((device) => (
                        <button
                            key={device}
                            onClick={() => updateField("device", device)}
                            className={`px-4 py-3 rounded-xl font-medium transition-all ${form.device === device
                                ? "bg-gradient-to-r from-[#bf953f]/80 to-[#bf953f] text-white shadow-lg"
                                : "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-white/5"
                                }`}
                        >
                            {device}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}