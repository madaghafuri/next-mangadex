import { CollectionFeed } from "@/components/collection-feed";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <main className="p-5">
      <section className="flex items-center gap-5">
        <Link href={"/"}>
          <ArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold">Collection</h1>
      </section>

      <section>
        <CollectionFeed />
      </section>
    </main>
  );
}
