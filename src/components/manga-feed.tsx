"use client";

import { BaseResponse, Data, getMangaFeed } from "@/app/api";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { useLocalStorage } from "@/lib/hooks";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export const Feed = ({ mangaId }: { mangaId: string }) => {
  const [chapters, setChapters] = useState<Data<"chapter">[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useLocalStorage<string[][]>("history", []);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const offset = 50 * (page - 1);
  const router = useRouter();

  const handlePrevPage = () => {
    setPage(page - 1);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", (page - 1).toString());
    router.push("?" + newParams.toString());
  };

  const handleNextPage = () => {
    setPage(page + 1);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", (page + 1).toString());
    router.push("?" + newParams.toString());
  };

  useEffect(() => {
    (async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("limit", "50");
      queryParams.append("translatedLanguage[]", "en");
      queryParams.append("order[chapter]", "desc");
      queryParams.append("offset", offset.toString());

      setLoading(true);
      const res = await fetch(
        "/api/manga/" + mangaId + "/feed" + "?" + queryParams.toString(),
        {
          method: "GET",
        }
      );
      const body = await res.json();
      setChapters(body.data.data);
      setLoading(false);
    })();
  }, [offset]);

  return (
    <div>
      <div className="flex flex-col gap-3">
        {chapters.length > 0 ? (
          chapters.map((val) => {
            const handleAppendHistory = () => {
              const historyToBe = [...history];
              const idx = historyToBe.findIndex(([id]) => id === val.id);
              idx !== -1 && historyToBe.splice(idx, 1);
              historyToBe.unshift([val.id, new Date().toISOString()]);
              setHistory(historyToBe);
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
      <div className="flex justify-center items-center gap-3 px-3 py-5">
        <button onClick={handlePrevPage} disabled={page === 1}>
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
