import { baseUrl } from "@/app/api";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const queryParams = new URLSearchParams(
    request.nextUrl.searchParams.toString()
  );

  const res = await fetch(
    baseUrl + "/manga/" + params.id + "/feed" + "?" + queryParams.toString()
  );
  if (!res.ok) throw new Error("error fetching from mangadex");
  const body = await res.json();

  return Response.json({ data: body });
}
