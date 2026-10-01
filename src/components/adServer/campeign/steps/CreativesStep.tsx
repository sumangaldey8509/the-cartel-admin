import { useState, useRef, useEffect } from "react";
import { X, Upload, Image as ImageIcon, File, RefreshCw } from "lucide-react";
import { CampaignForm } from "@/interface/adServer";

interface Props {
    form: CampaignForm;
    updateField: <K extends keyof CampaignForm>(key: K, value: CampaignForm[K]) => void;
}

interface FileWithPreview {
    file: File;
    preview: string;
    id: string;
}

export default function CreativesStep({ form, updateField }: Props) {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize from existing form.creatives
    useEffect(() => {
        if (form.creatives.length > 0 && files.length === 0) {
            const initialFiles = form.creatives.map((file) => ({
                file,
                preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
                id: `${file.name}-${Date.now()}-${Math.random()}`,
            }));
            setFiles(initialFiles);
        }
    }, [form.creatives]);

    const updateParentFiles = (newFiles: FileWithPreview[]) => {
        const rawFiles = newFiles.map((item) => item.file);
        updateField("creatives", rawFiles);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        const newFiles: FileWithPreview[] = selectedFiles.map((file) => ({
            file,
            preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
            id: `${file.name}-${Date.now()}-${Math.random()}`,
        }));
        const updated = [...files, ...newFiles];
        setFiles(updated);
        updateParentFiles(updated);
    };

    const removeFile = (id: string) => {
        const removed = files.find((f) => f.id === id);
        if (removed?.preview) URL.revokeObjectURL(removed.preview);
        const updated = files.filter((f) => f.id !== id);
        setFiles(updated);
        updateParentFiles(updated);
    };

    const replaceFile = (id: string) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*,video/*";
        input.onchange = (e: any) => {
            const newFile = e.target.files?.[0];
            if (newFile) {
                const oldFile = files.find((f) => f.id === id);
                if (oldFile?.preview) URL.revokeObjectURL(oldFile.preview);
                const updated = files.map((f) =>
                    f.id === id
                        ? {
                            file: newFile,
                            preview: newFile.type.startsWith("image/") ? URL.createObjectURL(newFile) : "",
                            id: f.id,
                        }
                        : f
                );
                setFiles(updated);
                updateParentFiles(updated);
            }
        };
        input.click();
    };

    // Cleanup previews on unmount
    useEffect(() => {
        return () => {
            files.forEach((f) => {
                if (f.preview) URL.revokeObjectURL(f.preview);
            });
        };
    }, []);

    return (
        <div className="space-y-6">
            <div
                className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-amber-500/50 transition-all cursor-pointer bg-background/30"
                onClick={() => fileInputRef.current?.click()}
            >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-300">Click or drag to upload creatives</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, MP4 (max 50MB)</p>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {files.map((fileItem) => (
                        <div
                            key={fileItem.id}
                            className="group relative rounded-xl overflow-hidden bg-slate-800 border border-white/10"
                        >
                            {fileItem.preview ? (
                                <img
                                    src={fileItem.preview}
                                    alt={fileItem.file.name}
                                    className="w-full h-32 object-cover"
                                />
                            ) : (
                                <div className="w-full h-32 flex items-center justify-center bg-background">
                                    <File className="w-12 h-12 text-gray-500" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button
                                    onClick={() => replaceFile(fileItem.id)}
                                    className="p-2 bg-amber-500 rounded-full hover:bg-amber-600 transition"
                                    title="Replace"
                                >
                                    <RefreshCw className="w-4 h-4 text-white" />
                                </button>
                                <button
                                    onClick={() => removeFile(fileItem.id)}
                                    className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
                                    title="Remove"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 p-2 truncate">{fileItem.file.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}