import { baseUrl } from "@/app/api";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const queryParams = new URLSearchParams(
    request.nextUrl.searchParams.toString()
  );

  const response = await fetch(
    baseUrl + "manga" + params.id + "?" + queryParams.toString()
  );
  if (!response.ok) throw new Error("error fetching from mangadex");
  const body = await response.json();

  return Response.json({ data: body });
}
