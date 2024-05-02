import { BaseResponse, baseUrl, getMangaList } from "../api";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const idList = [
  "fa431951-bce5-48cb-b75b-5b13fe9432a3",
  "b0b721ff-c388-4486-aa0f-c2b0bb321512",
  "e18fe8c6-f6dc-4f05-8462-7b2083ff9a6c",
  "b73371d4-02dd-4db0-b448-d9afa3d698f1",
  "8f8b7cb0-7109-46e8-b12c-0448a6453dfa",
  "b41bef1e-7df9-4255-bd82-ecf570fec566",
  "d90ea6cb-7bc3-4d80-8af0-28557e6c4e17",
  "cc1b8669-82b2-4232-99c1-40d48fc2d988",
];

const getStaffPicks = async () => {
  const queryParams = new URLSearchParams();
  idList.forEach((val) => {
    queryParams.append("ids[]", val);
  });
  queryParams.append("includes[]", "cover_art");

  const res = await fetch(baseUrl + "/manga" + "?" + queryParams.toString());
  const body = await res.json();

  return body as BaseResponse;
};

const getPopularTitles = async () => {
  const queryParams = new URLSearchParams();
  queryParams.append("limit", "10");
  queryParams.append("includes[]", "cover_art");
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 7);
  queryParams.append("createdAtSince", currentDate.toISOString().split(".")[0]);

  const resp = await fetch(baseUrl + "/manga" + "?" + queryParams.toString());
  const body = await resp.json();

  return body as BaseResponse;
};

export default async function Home() {
  const latestManga = await getMangaList({
    "order[latestUploadedChapter]": "desc",
    limit: "12",
  });

  const staffPicks = await getStaffPicks();
  const popularTitles = await getPopularTitles();

  return (
    <main className="flex min-h-screen min-w-screen flex-col">
      <section className="relative">
        <Carousel>
          <CarouselContent>
            {popularTitles.data.map((val) => {
              const cover = val.relationships.find(
                (val) => val.type === "cover_art"
              );
              const imageUrl =
                "https://uploads.mangadex.org/covers/" +
                val.id +
                "/" +
                cover?.attributes.fileName;
              return (
                <CarouselItem
                  key={val.id}
                  className="relative h-[300px] md:[400px]"
                >
                  <Image
                    src={imageUrl}
                    className="w-full object-cover"
                    width={128}
                    height={512}
                    alt="manga cover"
                  />
                  <div
                    style={{
                      background:
                        "linear-gradient(to bottom, hsla(0, 0%, 7%, 0.6), hsla(0, 0%, 7%, 1))",
                    }}
                    className="absolute inset-0"
                  />
                  <div className="absolute inset-0 left-8 flex items-center gap-3">
                    <Image
                      src={imageUrl}
                      width={128}
                      height={256}
                      alt="manga cover"
                      className="aspect-[5/7] rounded"
                    />
                    <div>
                      <h2 className="text-xl font-bold">
                        {val.attributes.title.en}
                      </h2>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
        <h1 className="text-2xl absolute top-3 left-3">Popular New Titles</h1>
      </section>

      <section className="md:flex md:flex-col md:items-center p-5">
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl truncate">Latest Manga</h1>
            <Link href={`/latest`}>
              <ChevronRight />
            </Link>
          </div>
          <div
            className={cn(
              "md:grid md:grid-cols-3 gap-3 md:max-w-[850px] md:bg-zinc-800 md:rounded-md",
              "flex flex-col gap-3 max-w-full"
            )}
          >
            {latestManga.data.map((value) => {
              const coverArt = value.relationships.find(
                (value) => value.type === "cover_art"
              );

              return (
                <div key={value.id} className={cn("flex gap-3", "md:p-3")}>
                  <Image
                    src={`https://uploads.mangadex.org/covers/${value.id}/${coverArt?.attributes.fileName}`}
                    alt="Cover Image"
                    width={64}
                    height={100}
                    className="rounded-sm aspect-[5/7]"
                  />
                  <div className="h-[100%] md:max-w-[128px] max-w-80">
                    <Link href={`title/${value.id}`}>
                      <h4 className="font-bold truncate">
                        {value.attributes.title.en}
                      </h4>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="p-5">
        <h1 className="text-2xl">Staff Picks</h1>
        <div className="flex items-center overflow-x-scroll gap-5 max-w-full">
          {staffPicks.data.map((val) => {
            const coverArt = val.relationships.find(
              (val) => val.type === "cover_art"
            );
            return (
              <div key={val.id}>
                <Link href={`title/${val.id}`}>
                  <Image
                    src={`https://uploads.mangadex.org/covers/${val.id}/${coverArt?.attributes.fileName}`}
                    alt="Cover Image"
                    width={256}
                    height={(7 / 5) * 256}
                    className="rounded-md aspect-[5/7] max-w-[256px]"
                  />
                  <h1 className="truncate">{val.attributes.title.en}</h1>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
