import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log("<<<<<<<<======== Hit ========>>>>>>>> /api/category/update");

    try {
        const payload = await req.json();

        console.log("category Create Payload", payload);

        const backendRes = await apiClient.post(API_ENDPOINTS.category.update, payload);

        console.log("Fetching from backend URL:", API_ENDPOINTS.category.update);
        console.log("category Create Response ===> Backend", backendRes?.data);

        if (!backendRes?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("category Create API Route Error:", error);
        return NextResponse.json(
            { error: "category creation failed." },
            { status: 500 }
        );
    }
}
