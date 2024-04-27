import { baseUrl } from "@/app/api";
import { NextRequest, userAgent } from "next/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const queryParams = new URLSearchParams(
    request.nextUrl.searchParams.toString()
  );
  queryParams.delete("id");

  const res = await fetch(
    baseUrl + "/manga/" + params.id + "/feed" + "?" + queryParams.toString(),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("error fetching from mangadex");
  const body = await res.json();

  return Response.json({ data: body });
}
