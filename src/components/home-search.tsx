"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useDebounce } from "@/lib/hooks";
import { BaseResponse, Data, baseUrl } from "@/app/api";
import Image from "next/image";
import Link from "next/link";

export const SearchTitle = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<Data[]>([]);
  const val = useDebounce(search);
  const queryParams = new URLSearchParams();
  queryParams.append("title", val);
  queryParams.append("includes[]", "cover_art");
  queryParams.append("limit", "5");

  useEffect(() => {
    if (!val) return;
    (async () => {
      const res = await fetch(
        baseUrl + "/manga" + "?" + queryParams.toString()
      );
      const body = (await res.json()) as BaseResponse;
      setResult(body.data);
    })();
  }, [val]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <div className="relative">
      <Input value={search} onChange={handleChange} placeholder="Search" />
      {result.length > 0 ? (
        <div className="absolute top-[53px] right-0 flex flex-col gap-2 z-50 bg-gray-700 rounded-md min-w-[300px] p-2">
          {result.map((value) => {
            const coverArt = value.relationships.find(
              (val) => val.type === "cover_art"
            );

            return (
              <div key={value.id} className="flex gap-3">
                <Image
                  src={`https://uploads.mangadex.org/covers/${value.id}/${coverArt?.attributes.fileName}`}
                  width={64}
                  height={100}
                  alt="Cover Image"
                  className="rounded-md"
                ></Image>
                <div>
                  <Link href={`/title/${value.id}`}>
                    <h4 className="font-bold">{value.attributes.title.en}</h4>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
