"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { useDebounce } from "@/lib/hooks";
import { BaseResponse, Data, baseUrl } from "@/app/api";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, Search } from "lucide-react";

export const SearchTitle = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<Data[]>([]);
  const val = useDebounce(search);
  const searchRef = useRef<HTMLInputElement>(null);

  const {
    data: searchResult,
    isFetching: isLoading,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: ["search"],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("title", val);
      queryParams.append("includes[]", "cover_art");
      queryParams.append("limit", "5");

      const res = await fetch("/api/manga" + "?" + queryParams.toString());
      if (!res.ok) throw new Error("error fetching from mangadex");
      const body = await res.json();
      return body.data as BaseResponse;
    },
    enabled: val.length > 0,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    if (val.length > 0) refetch();
  }, [val]);

  useEffect(() => {
    if (searchRef.current !== null && open) searchRef.current.focus();
  }, [open]);

  return (
    <div
      className={cn(
        "relative transition-transform duration-300",
        open ? "fixed p-5 left-0 right-0 m-auto bg-zinc-800" : ""
      )}
    >
      <Input
        ref={searchRef}
        value={search}
        onChange={handleChange}
        placeholder="Search"
        type="search"
        onBlur={() => setOpen(false)}
        onBlurCapture={() => {
          setTimeout(() => {
            setOpen(false);
          }, 500);
        }}
        className={cn(open ? "block" : "hidden")}
      />
      <div
        className={cn(
          "p-2 rounded bg-background items-center justify-center",
          open ? "hidden" : "flex"
        )}
      >
        <Search
          onClick={() => {
            setOpen(true);
          }}
          className="opacity-50"
        />
      </div>
      {isLoading ? (
        <LoaderCircle className="animate-spin" />
      ) : isFetched ? (
        <div
          className={cn(
            "absolute top-[53px] right-0 flex-col gap-2 z-50 bg-zinc-800 rounded-md min-w-[300px] p-2",
            open ? "flex mt-5" : "hidden"
          )}
        >
          {searchResult?.data.map((value) => {
            const coverArt = value.relationships.find(
              (val) => val.type === "cover_art"
            );

            return (
              <div key={value.id} className="flex gap-3 hover:bg-zinc-700">
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
