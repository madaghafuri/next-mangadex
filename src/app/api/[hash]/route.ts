import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      hash: string;
    };
  }
) {
  const url = request.nextUrl.searchParams.get("url");
  const fileName = request.nextUrl.searchParams.get("fileName");
  const hash = params.hash;

  const resp = await fetch(url + "/data-saver/" + hash + "/" + fileName);
  if (!resp.ok) throw new Error("error fetching from mangadex");

  const body = await resp.arrayBuffer();

  return new Response(body);
}
