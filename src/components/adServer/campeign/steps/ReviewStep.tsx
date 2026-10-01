import { CampaignForm } from "@/interface/adServer";

interface Props {
    form: CampaignForm;
}

export default function ReviewStep({ form }: Props) {
    return (
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReviewCard title="Basic Information">
                    <InfoRow label="Campaign Name" value={form.name} />
                    <InfoRow label="Advertiser" value={form.advertiser} />
                    <InfoRow label="Objective" value={form.objective} />
                </ReviewCard>

                <ReviewCard title="Budget & Bidding">
                    <InfoRow label="Total Budget" value={`$${form.budget}`} />
                    <InfoRow label="Bid Amount" value={`$${form.bid}`} />
                </ReviewCard>

                <ReviewCard title="Targeting">
                    <InfoRow label="Location" value={form.geo} />
                    <InfoRow label="Device" value={form.device} />
                </ReviewCard>

                <ReviewCard title="Publishers">
                    <div className="flex flex-wrap gap-2">
                        {form.publishers.length > 0 ? (
                            form.publishers.map((p) => (
                                <span key={p} className="px-2 py-1 bg-amber-500/20 rounded-lg text-xs">
                                    {p}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500">None selected</span>
                        )}
                    </div>
                </ReviewCard>

                <ReviewCard title="Creatives">
                    <div className="flex flex-wrap gap-2">
                        {form.creatives.map((file, i) => (
                            <span key={i} className="text-xs text-gray-300">
                                📎 {file.name}
                            </span>
                        ))}
                    </div>
                </ReviewCard>

                <ReviewCard title="Ad Groups">
                    <div className="space-y-3">
                        {form.adGroups.map((group, i) => (
                            <div key={i} className="text-sm">
                                <p className="font-semibold text-amber-400">{group.name}</p>
                                <p className="text-gray-400 text-xs">
                                    {group.ads.length} ad(s)
                                </p>
                            </div>
                        ))}
                    </div>
                </ReviewCard>
            </div>
        </div>
    );
}

function ReviewCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl bg-background border border-white/10 p-4">
            <h3 className="font-semibold text-gray-200 mb-3 pb-2 border-b border-white/10">{title}</h3>
            {children}
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between py-1">
            <span className="text-gray-400 text-sm">{label}</span>
            <span className="text-gray-200 text-sm font-medium">{value || "—"}</span>
        </div>
    );
}