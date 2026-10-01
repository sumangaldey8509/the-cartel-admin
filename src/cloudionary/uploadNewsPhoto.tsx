import appClient from "@/lib/appClient";

export const uploadToCloudinary = async (file: File, type: string) => {
    // Get unique signature for this file type
    const sigRes = await appClient.post("/api/signature/photo", { type });
    console.log({ sigRes })
    const { timestamp, folder, signature, cloudName, public_id } = sigRes.data;

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    form.append("timestamp", timestamp.toString());
    form.append("signature", signature);
    form.append("folder", folder);
    form.append("overwrite", "true");
    form.append("public_id", public_id);

    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: form,
    });

    const data = await uploadResponse.json();
    if (!uploadResponse.ok) throw new Error(data.error?.message || "Upload failed");
    return data.secure_url;
};

export const uploadPublisherPhoto = async (
    file: File,
    publisherId: string,
    folderName?: string
): Promise<string> => {

    // 1️⃣ Get signed upload params
    const sigRes = await appClient.post("/api/signature/publisherPhotos", {
        publisherId,
        folderName
    });

    const {
        timestamp,
        folder,
        signature,
        cloudName,
        public_id,
        apiKey,
    } = sigRes.data;

    // 2️⃣ Prepare upload form
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", apiKey);
    form.append("timestamp", timestamp.toString());
    form.append("signature", signature);
    form.append("folder", folder);
    form.append("public_id", public_id);
    form.append("overwrite", "true");
    form.append("invalidate", "true");

    // 3️⃣ Upload to Cloudinary
    const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
            method: "POST",
            body: form,
        }
    );

    const data = await uploadResponse.json();

    if (!uploadResponse.ok) {
        throw new Error(data?.error?.message || "Publisher photo upload failed");
    }

    // 4️⃣ Return image URL
    return data.secure_url;
};