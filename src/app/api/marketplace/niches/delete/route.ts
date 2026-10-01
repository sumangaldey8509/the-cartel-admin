import { authClient } from "@/lib/authClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const idParams = searchParams.get("ids");

    let nicheId: string[] = [];

    const getAuthClient = await authClient()

    if (idParams) {
        try {
            nicheId = JSON.parse(idParams);
        } catch (error) {
            console.log("Invalid Coin ID format", error);

            return NextResponse.json(
                { message: "Invalid Coin id format" },
                { status: 400 }
            );
        }
    }

    try {
        const backendRes = await getAuthClient.delete(
            API_ENDPOINTS.marketplace.niches.delete(nicheId)
        );


        if (!backendRes?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("Niches deletion failed", error);

        return NextResponse.json({ error: "Niches deletion failed" }, { status: 500 });
    }
}
