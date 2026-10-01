import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const idParams = searchParams.get("ids");

    let tokenIds: string[] = [];

    if (idParams) {
        try {
            tokenIds = JSON.parse(idParams);
        } catch (error) {
            console.log("Invalid consultation submission ID format", error);

            return NextResponse.json(
                { message: "Invalid consultation submission id format" },
                { status: 400 }
            );
        }
    }

    // console.log("Final payload", clientId, CoinId);

    try {
        const backendRes = await apiClient.delete(
            API_ENDPOINTS.consultaion.delete(tokenIds)
        );

        console.log("News delete res ===> Backend", backendRes.data);

        if (!backendRes?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("News deletion failed", error);

        return NextResponse.json({ error: "News deletion failed" }, { status: 500 });
    }
}
