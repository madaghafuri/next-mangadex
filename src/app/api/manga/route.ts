import { baseUrl } from "@/app/api";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const queryParams = new URLSearchParams(
    request.nextUrl.searchParams.toString()
  );
  queryParams.append("includes[]", "cover_art");
  const response = await fetch(
    baseUrl + "/manga" + "?" + queryParams.toString()
  );
  if (!response.ok) throw new Error("error fetching from mangadex");

  const body = await response.json();
  return Response.json({ data: body });
}
