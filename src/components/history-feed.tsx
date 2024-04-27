"use client";

import {
  BaseResponse,
  CoverAttr,
  Data,
  getChapterList,
  getCoverList,
  getMangaList,
} from "@/app/api";
import { useLocalStorage } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import Image from "next/image";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const HistoryFeed = () => {
  const [history, setHistory] = useLocalStorage<string[][]>("history", []);
  const [loading, setLoading] = useState(false);
  const [chapterList, setChapterList] = useState<Data<"chapter">[]>([]);

  useEffect(() => {
    (async () => {
      if (history.length === 0) return;
      const queryParams = new URLSearchParams();
      for (const val of history) {
        queryParams.append("ids[]", val[0]);
      }
      setLoading(true);
      const response = await getChapterList(queryParams);
      const mangaIds = response.data.map((val) => {
        const manga = val.relationships.find((val) => val.type === "manga");
        if (!manga) return;
        return manga.id;
      });

      const coverQueryParams = new URLSearchParams();
      for (const id of mangaIds) {
        coverQueryParams.append("ids[]", id as string);
      }
      const coverResponse = (await getMangaList(
        {},
        coverQueryParams
      )) as BaseResponse;
      // const data = response.data.map((val, index) => {
      //   const mangaToMatch = val.relationships.find(
      //     (val) => val.type === "manga"
      //   );
      //   const cover = coverResponse.data.find(
      //     (val) => val.id === mangaToMatch?.id
      //   );
      //   const coverImage = cover?.relationships.find(
      //     (val) => val.type === "cover_art"
      //   );
      //   return {
      //     ...val,
      //     cover: coverImage?.attributes.fileName,
      //   };
      // });
      const data = history.map((val, index) => {
        const [chapterId, time] = val;

        const chapData = response.data.find((val) => val.id === chapterId);
        const mangaId = chapData?.relationships.find(
          (val) => val.type === "manga"
        );
        const mangaTo = coverResponse.data.find(
          (val) => val.id === mangaId?.id
        );
        const coverImage = mangaTo?.relationships.find(
          (val) => val.type === "cover_art"
        );

        return {
          ...chapData,
          cover: coverImage?.attributes.fileName,
          readAt: time,
        };
      });
      setChapterList(data as unknown as Data<"chapter">[]);
      setLoading(false);
    })();
  }, [history]);

  return (
    <div>
      <h1 className="text-2xl font-bold">History</h1>
      <div className={cn("flex flex-col gap-3", loading ? "items-center" : "")}>
        {loading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          chapterList.map((val) => {
            const manga = val.relationships.find((val) => val.type === "manga");
            return (
              <div key={val.id} className="rounded truncate p-3 bg-zinc-800 ">
                <h1 className="font-bold tracking-wide max-w-full truncate">
                  {manga?.attributes.title.en}
                </h1>
                <Separator orientation="horizontal" className="bg-zinc-600" />
                <div className="flex gap-3 py-2">
                  <Image
                    //@ts-ignore
                    src={`https://uploads.mangadex.org/covers/${manga?.id}/${val.cover}`}
                    alt="Cover image"
                    width={64}
                    height={128}
                    className="aspect-[5/7] rounded"
                  />
                  <div>
                    <Link href={`/chapter/${val.id}`}>
                      <h1 className="max-w-full truncate text-sm font-bold">
                        {val.attributes.chapter} - {val.attributes.title}
                      </h1>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
