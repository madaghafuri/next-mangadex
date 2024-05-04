import { baseUrl } from "@/app/api";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const queryParams = new URLSearchParams(request.nextUrl.searchParams);

  const res = await fetch(baseUrl + "/chapter" + "?" + queryParams.toString());
  if (!res.ok) throw new Error("error fetching api from mangadex");
  const body = await res.json();

  return Response.json({ data: body });
}
