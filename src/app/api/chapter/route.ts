import { baseUrl } from "@/app/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, res: NextResponse) {
  const queryParams = new URLSearchParams(
    request.nextUrl.searchParams.toString()
  );

  const resp = await fetch(baseUrl + "/chapter" + "?" + queryParams.toString());
  if (!resp.ok) throw new Error("error fetching from mangadex");

  const body = await resp.json();

  return Response.json({ data: body });
}
