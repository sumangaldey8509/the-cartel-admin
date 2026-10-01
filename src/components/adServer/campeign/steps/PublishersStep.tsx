import { CampaignForm } from "@/interface/adServer";

interface Props {
    form: CampaignForm;
    updateField: <K extends keyof CampaignForm>(key: K, value: CampaignForm[K]) => void;
}

const publisherOptions: string[] = [
    "Times of India",
    "NDTV",
    "ESPN",
    "TechCrunch",
    "CoinDesk",
    "YourSite A",
    "YourSite B",
];

export default function PublishersStep({ form, updateField }: Props) {
    const togglePublisher = (pub: string) => {
        const exists = form.publishers.includes(pub);
        updateField(
            "publishers",
            exists ? form.publishers.filter((p) => p !== pub) : [...form.publishers, pub]
        );
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-400">Select publishers where your ads will appear</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                {publisherOptions.map((pub) => (
                    <label
                        key={pub}
                        className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${form.publishers.includes(pub)
                            ? "bg-[#bf953f]/10 border-[#bf953f]/50 shadow-md"
                            : "bg-gray-900/30 border-white/10 hover:bg-slate-800/50"
                            }`}
                    >
                        <span className="font-medium text-gray-200">{pub}</span>
                        <input
                            type="checkbox"
                            checked={form.publishers.includes(pub)}
                            onChange={() => togglePublisher(pub)}
                            className="w-4 h-4 rounded border-gray-600 text-[#bf953f] focus:ring-[#bf953f] focus:ring-offset-0 bg-slate-800"
                        />
                    </label>
                ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">
                Selected: {form.publishers.length} publisher(s)
            </div>
        </div>
    );
}