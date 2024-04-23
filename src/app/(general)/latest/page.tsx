import { LatestManga } from "@/components/latest-manga";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  return (
    <main className="p-5">
      <section className="flex items-center gap-5">
        <ArrowLeft />
        <h1 className="text-2xl font-semibold tracking-wide">Latest Update</h1>
      </section>

      <section>
        <LatestManga />
      </section>
    </main>
  );
}
