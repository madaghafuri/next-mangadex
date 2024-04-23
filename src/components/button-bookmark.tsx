"use client";

import { useLocalStorage } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";

export const BookmarkButton = ({
  className,
  mangaId,
}: {
  className?: string;
  mangaId: string;
}) => {
  const [collection, setCollection] = useLocalStorage<string[]>(
    "collection",
    []
  );

  console.log(collection);

  const handleAddToColl = () => {
    if (collection.includes(mangaId)) return;
    setCollection([...collection, mangaId]);
  };

  return (
    <button
      className={cn(
        "bg-foreground text-background flex justify-center items-center py-2 text-xl rounded",
        className
      )}
      onClick={handleAddToColl}
    >
      <Bookmark />
    </button>
  );
};
