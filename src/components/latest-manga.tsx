"use client";

import { BaseResponse, Data, getMangaList } from "@/app/api";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const LatestManga = () => {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const [page, setPage] = useState(parseInt(params.get("page") || "1"));
  const offset = 32 * (page - 1);
  const [mangaList, setMangaList] = useState<Data<"manga">[]>([]);
  const [loading, setLoading] = useState<"idle" | "loading" | "loaded">("idle");

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams();
      params.append("limit", "32");
      params.append("order[latestUploadedChapter]", "desc");
      params.append("offset", offset.toString());
      setLoading("loading");
      const res = await fetch("/api/manga" + "?" + params.toString());
      const body = await res.json();
      setMangaList(body.data.data);
      setLoading("loaded");
    })();
  }, [offset]);

  const handleNextPage = () => {
    setPage(page + 1);
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", (page + 1).toString());
    router.push(path + "?" + newParams.toString());
  };

  const handlePrevPage = () => {
    if (page === 1) return;
    setPage(page - 1);
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", (page - 1).toString());
    router.push(path + "?" + newParams.toString());
  };

  return (
    <div>
      <div className="flex flex-col gap-3">
        {loading === "loading" && (
          <LoaderCircle className="animate-spin size-14 self-center" />
        )}
        {mangaList.map((val) => {
          const cover = val.relationships.find(
            (val) => val.type === "cover_art"
          );

          return (
            <div key={val.id} className="bg-zinc-800 p-3 rounded flex gap-3">
              <Link href={`/title/${val.id}`}>
                <Image
                  src={`https://uploads.mangadex.org/covers/${val.id}/${cover?.attributes.fileName}`}
                  alt="Cover Images"
                  width={70}
                  height={98}
                  className="aspect-[5/7] rounded max-w-[70px] h-auto object-cover object-center"
                />
              </Link>
              <Link href={`/title/${val.id}`}>
                <h2 className="text-sm font-bold">{val.attributes.title.en}</h2>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-5 px-3 py-5">
        <button onClick={handlePrevPage}>
          <ArrowLeft />
        </button>
        {page}
        <button onClick={handleNextPage}>
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};
