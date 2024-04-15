import { BaseResponse, baseUrl, getLatestManga } from "./api";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

export default async function Home() {
  const latestManga = (await getLatestManga()) as BaseResponse;

  const staffPicks = await getStaffPicks();

  return (
    <main className="flex min-h-screen min-w-screen flex-col p-5 relative">
      <section>
        <h1>Popular New Titles</h1>
      </section>

      <section className="flex flex-col items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl truncate">Latest Manga</h1>
          <div className="md:grid md:grid-cols-3 md:max-w-[800px] md:bg-gray-800 md:rounded-md">
            {latestManga.data.map((value) => {
              const coverArt = value.relationships.find(
                (value) => value.type === "cover_art"
              );

              return (
                <div
                  key={value.id}
                  className={cn("flex items-center gap-3", "md:p-3")}
                >
                  <Image
                    src={`https://uploads.mangadex.org/covers/${value.id}/${coverArt?.attributes.fileName}`}
                    alt="Cover Image"
                    width={64}
                    height={100}
                    className="rounded-sm"
                  />
                  <div className="h-[100%] w-[180px]">
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

      <section>
        <h1 className="text-2xl">Staff Picks</h1>
        <div className="flex items-center overflow-scroll gap-5 max-w-full">
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
