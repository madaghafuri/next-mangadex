"use client";
import { BaseResponse, Data, getMangaList } from "@/app/api";
import { useLocalStorage } from "@/lib/hooks";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const CollectionFeed = () => {
  const [collection, setCollection] = useLocalStorage("collection", []);
  const [mangaList, setMangaList] = useState<Data<"manga">[]>([]);

  console.log(collection);

  useEffect(() => {
    (async () => {
      if (collection.length === 0) return;
      const queryParams = new URLSearchParams();
      collection.forEach((val) => {
        queryParams.append("ids[]", val);
      });
      queryParams.append("order[latestUploadedChapter]", "desc");

      const response = (await getMangaList({}, queryParams)) as BaseResponse;
      setMangaList(response.data);
    })();
  }, [collection]);

  return (
    <div className="flex flex-col gap-3">
      {mangaList.length > 0 ? (
        mangaList.map((val) => {
          const cover = val.relationships.find(
            (val) => val.type === "cover_art"
          );

          return (
            <div key={val.id} className="rounded bg-zinc-800 p-3 flex gap-3">
              <Image
                src={`https://uploads.mangadex.org/covers/${val.id}/${cover?.attributes.fileName}`}
                width={64}
                height={64}
                alt="cover image"
                className="aspect-[5/7] rounded"
              />
              <div className="max-w-[400px] truncate">
                <Link href={`/title/${val.id}`}>{val.attributes.title.en}</Link>
              </div>
            </div>
          );
        })
      ) : (
        <h1>No Collection Added</h1>
      )}
    </div>
  );
};
