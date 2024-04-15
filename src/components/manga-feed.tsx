"use client";

import { BaseResponse, Data, getMangaFeed } from "@/app/api";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

export const Feed = ({ mangaId }: { mangaId: string }) => {
  const [chapters, setChapters] = useState<Data<"chapter">[]>([]);

  useEffect(() => {
    (async () => {
      const feed = (await getMangaFeed(mangaId)) as BaseResponse;
      setChapters(feed.data as unknown as Data<"chapter">[]);
    })();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-3">
        {chapters.length > 0 ? (
          chapters.map((val) => {
            return (
              <div
                key={val.id}
                className="p-2 rounded-md bg-zinc-800 text-sm font-extrabold hover:bg-zinc-700"
              >
                Chapter {val.attributes.chapter} - {val.attributes.title}
              </div>
            );
          })
        ) : (
          <Skeleton className="w-full h-[100vh] bg-zinc-800" />
        )}
      </div>
    </div>
  );
};
