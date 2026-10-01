import { authClient } from "@/lib/authClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";
import { AxiosError } from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "10";
  const getAuthClient = await authClient();

  try {
    const backendRes = await getAuthClient.get(
      API_ENDPOINTS.wallet.get(search, page, limit)
    );


    if (!backendRes?.data?.wallets) {
      return NextResponse.json(backendRes.data);
    }

    return NextResponse.json(backendRes.data, {
      status: backendRes.data.statusCode,
    });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status ?? 500;
      const message =
        (error.response?.data as { message?: string })?.message ??
        error.message ??
        "Wallet list fetching failed.";

      return NextResponse.json({ error: message }, { status: statusCode });
    }

    console.error("Unexpected wallet error", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
