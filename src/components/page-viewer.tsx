"use client";

import { ChapterResponse, MangaAttr } from "@/app/api";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { KeyboardEvent, MouseEvent, useEffect, useState } from "react";
import { Sheet, SheetContent } from "./ui/sheet";
import { cn } from "@/lib/utils";
import { ChevronLeft, Home } from "lucide-react";
import Link from "next/link";
import { SideNav } from "./side-nav";

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
    router.replace(pathname + "?" + newParams.toString());
  };

  const handleNextPage = () => {
    if (page === chapter.chapter.data.length) return;
    setPage(page + 1);
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", (page + 1).toString());
    router.replace(pathname + "?" + newParams.toString());
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
          className={cn("fixed top-0 left-0 right-0 m-auto p-7 z-50", "flex")}
        >
          <h1 className="max-w-[90%] truncate">{manga.title.en}</h1>
          <ChevronLeft
            className="w-[10%]"
            onClick={() => setOpenHeader(!openHeader)}
          />
        </section>
      ) : null}
      <div className="flex flex-row-reverse overflow-x-hidden absolute top-0 left-0 right-0 bottom-0 m-auto">
        {chapter.chapter.dataSaver.map((val, index) => {
          const thisPage = val.split("-")[0];
          const chapHash = val.split("-")[1];

          const trimmedPage = thisPage.replace(/[a-zA-Z]/gi, "");

          return (
            <img
              key={`${chapHash}-${thisPage}`}
              src={`${chapter.baseUrl}/data-saver/${chapter.chapter.hash}/${val}`}
              alt="Chapter Page"
              width={512}
              height={0}
              className={cn(
                "object-contain",
                page.toString() === trimmedPage ? "block" : "hidden"
              )}
              onClick={handleClick}
            />
          );
        })}
      </div>
      <Sheet open={openHeader} onOpenChange={setOpenHeader}>
        <SheetContent className="bg-zinc-800">
          <SideNav />
        </SheetContent>
      </Sheet>
    </div>
  );
};
