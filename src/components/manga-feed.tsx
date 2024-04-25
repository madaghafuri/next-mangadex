"use client";

import { BaseResponse, Data, getMangaFeed } from "@/app/api";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { useLocalStorage } from "@/lib/hooks";

export const Feed = ({ mangaId }: { mangaId: string }) => {
  const [chapters, setChapters] = useState<Data<"chapter">[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useLocalStorage<string[]>("history", []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const feed = (await getMangaFeed(mangaId)) as BaseResponse;
      setChapters(feed.data as unknown as Data<"chapter">[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-3">
        {chapters.length > 0 ? (
          chapters.map((val) => {
            const handleAppendHistory = () => {
              setHistory([...history, val.id]);
              console.log("clicked");
            };

            return (
              <Link
                key={val.id}
                href={`/chapter/${val.id}`}
                className="p-2 rounded-md bg-zinc-800 text-sm font-extrabold hover:bg-zinc-700"
                onClick={handleAppendHistory}
              >
                Chapter {val.attributes.chapter} - {val.attributes.title}
              </Link>
            );
          })
        ) : loading ? (
          <Skeleton className="w-full h-[100vh] bg-zinc-800" />
        ) : (
          <h1 className="text-xl font-bold">No Chapter Available</h1>
        )}
      </div>
    </div>
  );
};
