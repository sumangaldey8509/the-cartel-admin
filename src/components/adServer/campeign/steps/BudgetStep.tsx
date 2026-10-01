import { CampaignForm } from "@/interface/adServer";

interface Props {
    form: CampaignForm;
    updateField: <K extends keyof CampaignForm>(key: K, value: CampaignForm[K]) => void;
}

export default function BudgetStep({ form, updateField }: Props) {
    return (
        <div className="space-y-6">
            <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Total Budget (USD) *</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                        type="number"
                        value={form.budget}
                        onChange={(e) => updateField("budget", e.target.value)}
                        placeholder="0.00"
                        min="100"
                        step="100"
                        className="w-full pl-8 pr-4 py-3 rounded-xl bg-background border border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-white placeholder:text-gray-500"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum budget: $100</p>
            </div>

            <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Bid Amount (USD) *</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                        type="number"
                        value={form.bid}
                        onChange={(e) => updateField("bid", e.target.value)}
                        placeholder="0.00"
                        step="0.5"
                        min="0.5"
                        className="w-full pl-8 pr-4 py-3 rounded-xl bg-background border border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-white placeholder:text-gray-500"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">Cost-per-click or CPM bid</p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-sm text-amber-400">💡 Estimated daily spend: ${form.budget ? (parseFloat(form.budget) / 30).toFixed(2) : "0"} </p>
            </div>
        </div>
    );
}