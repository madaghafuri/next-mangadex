"use client";

import { ChapterResponse, MangaAttr } from "@/app/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { KeyboardEvent, MouseEvent, useEffect, useState } from "react";
import { Sheet, SheetContent } from "./ui/sheet";
import { cn } from "@/lib/utils";
import { ChevronLeft, Home } from "lucide-react";
import Link from "next/link";

export const PageViewer = ({
  chapter,
  manga,
}: {
  chapter: ChapterResponse;
  manga: MangaAttr;
}) => {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [page, setPage] = useState(parseInt(params.get("page") || "1"));
  const [openHeader, setOpenHeader] = useState(false);
  const [showHeader, setShowHeader] = useState(false);

  const handlePrevPage = () => {
    if (page === 1) return;
    setPage(page - 1);
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", (page - 1).toString());
    router.push(pathname + "?" + newParams.toString());
  };

  const handleNextPage = () => {
    if (page === chapter.chapter.data.length) return;
    setPage(page + 1);
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", (page + 1).toString());
    router.push(pathname + "?" + newParams.toString());
  };

  useEffect(() => {
    const keyNavigation = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleNextPage();
      if (e.key === "ArrowRight") handlePrevPage();
    };

    // @ts-ignore
    window.addEventListener("keyup", keyNavigation);

    return () => {
      // @ts-ignore
      window.removeEventListener("keyup", keyNavigation);
    };
  }, []);

  useEffect(() => {
    if (!showHeader) return;
    const timer = setTimeout(() => {
      setShowHeader(false);
    }, 7000);

    return () => {
      clearTimeout(timer);
    };
  }, [showHeader]);

  const handleClick = (e: MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    if (e.nativeEvent.offsetX < e.currentTarget.width * (1 / 3)) {
      handleNextPage();
    } else if (
      e.nativeEvent.offsetX >= e.currentTarget.width * (1 / 3) &&
      e.nativeEvent.offsetX <= e.currentTarget.width * (2 / 3)
    ) {
      setShowHeader(!showHeader);
    } else if (e.nativeEvent.offsetX > e.currentTarget.width * (2 / 3)) {
      handlePrevPage();
    }
  };

  return (
    <div
      className="relative min-h-screen"
      onClick={() => setShowHeader(!showHeader)}
    >
      {showHeader ? (
        <section
          className={cn("fixed top-0 left-0 right-0 m-auto p-7", "flex")}
        >
          <h1 className="grow">{manga.title.en}</h1>
          <ChevronLeft
            className="w-[10%]"
            onClick={() => setOpenHeader(!openHeader)}
          />
        </section>
      ) : null}
      <img
        src={`${chapter.baseUrl}/data-saver/${chapter.chapter.hash}/${
          chapter.chapter.dataSaver[page - 1]
        }`}
        alt="Page Content"
        width={512}
        height={0}
        sizes="(min-width: 768px) 100vh,"
        className="absolute top-0 bottom-0 right-0 left-0 m-auto"
        onClick={handleClick}
      />
      <Sheet open={openHeader} onOpenChange={setOpenHeader}>
        <SheetContent className="bg-zinc-800">
          <Link href={`/`} className="flex gap-3 items-center">
            <Home />
            <h1 className="font-bold">Home</h1>
          </Link>
        </SheetContent>
      </Sheet>
    </div>
  );
};
