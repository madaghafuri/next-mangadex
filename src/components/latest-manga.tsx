"use client";

import { BaseResponse, Data, getMangaList } from "@/app/api";
import { ArrowLeft, ArrowRight } from "lucide-react";
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

  useEffect(() => {
    (async () => {
      const res = (await getMangaList({
        "order[latestUploadedChapter]": "desc",
        limit: "32",
        offset: offset.toString(),
      })) as BaseResponse;

      setMangaList(res.data);
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
        {mangaList.map((val) => {
          const cover = val.relationships.find(
            (val) => val.type === "cover_art"
          );

          const tes = val.attributes.title.en === "Lying Gyaru" ? val : null;
          console.log(tes?.relationships);

          return (
            <div key={val.id} className="bg-zinc-800 p-3 rounded flex gap-3">
              <Image
                src={`https://uploads.mangadex.org/covers/${val.id}/${cover?.attributes.fileName}`}
                alt="Cover Images"
                width={64}
                height={128}
                className="aspect-[5/7] object-cover rounded"
              />
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
