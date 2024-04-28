import { baseUrl } from "@/app/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, res: NextResponse) {
  const fileName = request.nextUrl.searchParams.get("fileName");
  const baseUrl = request.nextUrl.searchParams.get("baseUrl");
  const chapterHash = request.nextUrl.searchParams.get("hash");

  // if (!fileName || !baseUrl || !chapterHash)
  //   return new Response("missing required paramter", { status: 400 });

  const thisResponse = new Response();
  thisResponse.headers.set("Content-Type", "image/jpeg");

  const resp = await fetch(
    baseUrl + "/data-saver/" + chapterHash + "/" + fileName
  );
  const blob = await resp.blob();
  const url = URL.createObjectURL(blob);

  return new Response(url);
}
