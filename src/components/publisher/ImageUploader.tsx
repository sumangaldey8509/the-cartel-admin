import { Upload, Image as ImageIcon, Edit, X } from 'lucide-react'
import { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ImageUploaderProps {
    image: File | null;
    imagePreview: string;
    setImage: (file: File | null) => void;
    setImagePreview: (preview: string) => void;
}

const ImageUploader = ({ image, imagePreview, setImage, setImagePreview }: ImageUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Create preview URL from the file
    // const previewUrl = value ? URL.createObjectURL(value) : null

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            // Validate file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('Image size should be less than 10MB');
                return;
            }

            setImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleRemoveImage = (e: React.MouseEvent) => {
        setImage(null);
        setImagePreview("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const triggerFileInput = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    return (
        <div>
            {/* Label */}
            <label className="flex items-center space-x-2 text-sm text-white mb-3 font-mono">
                <ImageIcon className="w-4 h-4" />
                <span>Profile Photo</span>
            </label>

            {/* Upload Area */}
            <div
                className="border-2 border-dashed border-[#333] rounded-lg p-6 text-center hover:border-[#bf953f] transition-all duration-300 bg-[#0A0A0A] cursor-pointer relative group"
                onClick={!imagePreview ? triggerFileInput : undefined}
            >
                {imagePreview ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        {/* Image Preview */}
                        <div className="relative w-full h-48 rounded-lg mb-4 overflow-hidden shadow-lg">
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Image Action Buttons */}
                        <div className="absolute top-2 right-2 flex space-x-2">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={triggerFileInput}
                                className="p-2 bg-[#bf953f] hover:bg-[#aa771c] rounded-full transition-all shadow-lg"
                                title="Change image"
                            >
                                <Edit className="w-3 h-3 text-white" />
                            </motion.button>
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleRemoveImage}
                                className="p-2 bg-red-600/80 hover:bg-red-600 rounded-full transition-all shadow-lg"
                                title="Remove image"
                            >
                                <X className="w-3 h-3 text-white" />
                            </motion.button>
                        </div>

                        <p className="text-[#C0C0C0] text-sm mt-2">
                            Click the edit icon to change image
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <Upload className="w-12 h-12 text-[#666] mx-auto mb-4 group-hover:text-[#bf953f] transition-colors" />
                        <p className="text-[#C0C0C0] text-sm mb-2">
                            Click to upload featured image
                        </p>
                        <p className="text-[#666] text-xs">
                            PNG, JPG, GIF up to 5MB
                        </p>
                    </motion.div>
                )}

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </div>
    )
}

export default ImageUploader