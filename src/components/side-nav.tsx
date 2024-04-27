import { Bookmark, History, Home } from "lucide-react";
import Link from "next/link";

export const SideNav = () => {
  return (
    <>
      <Link href={"/"} className="flex items-center gap-3">
        <Home />
        <h1 className="font-bold">Home</h1>
      </Link>
      <Link href={"/collection"} className="flex items-center gap-3">
        <Bookmark />
        <h1 className="font-bold">Collection</h1>
      </Link>
      <Link href={"/history"} className="flex items-center gap-3">
        <History />
        <h1 className="font-bold">History</h1>
      </Link>
    </>
  );
};
