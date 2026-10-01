import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") ?? "";

    try {
        const backendRes = await apiClient.get(API_ENDPOINTS.news.slug(slug));

        if (!backendRes?.data?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("error while fetching news list", error)
        return NextResponse.json(
            { error: "news list fetching failed." },
            { status: 500 }
        );
    }
}
