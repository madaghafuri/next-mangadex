import { Data, MangaAttr, getChapterData, getChapterImage } from "@/app/api";
import { PageViewer } from "@/components/page-viewer";

export default async function Page({
  params,
}: {
  params: { chapterId: string };
}) {
  const chapter = await getChapterImage(params.chapterId);
  const res = await getChapterData(params.chapterId);
  const data = res.data as unknown as Data<"chapter">;
  const manga = data.relationships.find((val) => val.type === "manga");

  return (
    <div>
      <title>
        {data.attributes.chapter + " | " + manga?.attributes.title.en}
      </title>
      <PageViewer
        chapter={chapter}
        manga={manga?.attributes || ({} as MangaAttr)}
      />
    </div>
  );
}
