import { getMangaById } from "@/app/api";
import { Feed } from "@/components/manga-feed";
import { Badge } from "@/components/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default async function Page({ params }: { params: { id: string } }) {
  const manga = await getMangaById(params.id);
  const cover_art = manga.data.relationships.find(
    (val) => val.type === "cover_art"
  );
  const altTitle = manga.data.attributes.altTitles.find((val) => !!val.en);
  const author = manga.data.relationships.find((val) => val.type === "author");
  const genres = manga.data.attributes.tags.filter(
    (val) => val.attributes.group === "genre"
  );
  const artist = manga.data.relationships.find((val) => val.type === "artist");

  return (
    <main className="p-8 md:p-16">
      <section className="flex items-start gap-5">
        <Image
          src={`https://uploads.mangadex.org/covers/${manga.data.id}/${cover_art?.attributes.fileName}`}
          alt="Cover"
          width={128}
          height={(5 / 7) * 256}
          className="aspect-[5/7] rounded-md object-cover"
        />
        <div className="flex flex-col justify-between">
          <h1 className="text-2xl font-bold">
            {manga.data.attributes.title.en}
          </h1>
          <h3>{altTitle?.en}</h3>
        </div>
      </section>

      <section className="pt-12 flex flex-col gap-3">
        <div className="flex flex-wrap gap-3">
          {manga.data.attributes.tags.map((val) => {
            return (
              <span
                key={val.id}
                className="bg-foreground text-background rounded px-2 uppercase font-bold text-xs"
              >
                {val.attributes.name.en}
              </span>
            );
          })}
        </div>
        <div className="flex gap-2 items-center">
          <span className="uppercase font-bold text-sm">
            Publication: {manga.data.attributes.year},{" "}
            {manga.data.attributes.status}
          </span>
          <div
            className={cn(
              " rounded-full flex items-center justify-center",
              manga.data.attributes.status === "ongoing" && "bg-green-600",
              manga.data.attributes.status === "completed" && "bg-blue-500"
            )}
            style={{
              height: "13px",
              width: "13px",
            }}
          />
        </div>
        <p className="text-ellipsis overflow-hidden">
          {manga.data.attributes.description.en}
        </p>
      </section>

      <section className="flex flex-col md:flex-row items-start gap-5 pt-12">
        <div className="md:w-[30%] flex flex-col gap-3">
          <div>
            <h1 className="font-bold text-xl">Authors</h1>
            <Badge title={author?.attributes.name as string} />
          </div>
          <div>
            <h1 className="font-bold text-xl">Artist</h1>
            <Badge title={artist?.attributes.name as string} />
          </div>
          <div>
            <h1 className="font-bold text-xl">Genres</h1>
            <div className="flex flex-wrap">
              {genres.map((val) => {
                return (
                  <Badge
                    key={val.id}
                    className="mr-3"
                    title={val?.attributes.name.en}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="md:grow w-[100%]">
          <Feed mangaId={params.id} />
        </div>
      </section>
    </main>
  );
}
