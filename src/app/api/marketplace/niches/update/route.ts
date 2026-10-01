import { authClient } from "@/lib/authClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const getAuthClient = await authClient()

    try {
        const payload = await req.json();

        const backendRes = await getAuthClient.post(API_ENDPOINTS.marketplace.niches.edit, payload);

        if (!backendRes?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("niche update API Route Error:", error);
        return NextResponse.json(
            { error: "niche update failed." },
            { status: 500 }
        );
    }
}
