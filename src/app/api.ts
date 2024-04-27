export const baseUrl = "https://api.mangadex.org";

export interface BaseResponse<Res = "collection"> {
  result: string;
  response: Res;
  data: Res extends "collection"
    ? Data[]
    : Res extends "entity"
    ? Data
    : Data[];
  limit: number;
  offset: number;
  total: number;
}

export interface Data<T = "manga"> {
  id: string;
  type: T extends "manga" ? "manga" : "";
  attributes: T extends "manga"
    ? MangaAttr
    : T extends "chapter"
    ? ChapterAttributes
    : never;
  relationships: T extends "manga"
    ? MangaRelationship[]
    : T extends "chapter"
    ? Relationship<MangaAttr>[]
    : never;
}

export interface Tag {
  id: string;
  type: string;
  attributes: {
    name: {
      [key: string]: string;
    };
    description: {
      [key: string]: string;
    };
    group: string;
    version: number;
  };
  relationships: [];
}

export interface MangaAttr {
  title: { [key: string]: string };
  altTitles: {
    [key: string]: string;
  }[];
  description: {
    [key: string]: string;
  };
  isLocked: boolean;
  links: object;
  originalLanguage: string;
  lastVolume: string;
  lastChapter: string;
  publicationDemographic: string;
  status: string;
  year: number;
  contentRating: string;
  tags: Tag[];
  state: string;
  chapterNumbersResetOnNewVolume: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
  availableTranslatedLanguage: [];
  latestUploadedChapter: string;
}

export interface MangaRelationship {
  id: string;
  type: string;
  attributes: Record<string, string | number>;
}

export interface ChapterAttributes {
  title: string;
  volume: string;
  chapter: string;
  translatedLanguage: string;
  externalUrl: string;
  publishAt: string;
  readableAt: string;
  createdAt: string;
  updatedAt: string;
  pages: number;
  version: number;
}

export interface Chapter {
  id: string;
  type: string;
  attributes: ChapterAttributes;
  relationships: Relationship[];
}

export interface ChapterResponse {
  result: string;
  baseUrl: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}

export interface Relationship<T = ChapterAttributes> {
  id: string;
  type: string;
  attributes: T;
}

export type QueryKeys =
  | "limit"
  | "offset"
  | "title"
  | "authorOrArtist"
  | "authors[]"
  | "artists[]"
  | "year"
  | "includedTags[]"
  | "includedTagsMode"
  | "excludedTags[]"
  | "excludedTagsMode"
  | "status[]"
  | "originalLanguage[]"
  | "ids[]"
  | "includes[]"
  | "group"
  | "hasAvailableChapters"
  | `order[latestUploadedChapter]`;

export type QueryParams = Partial<Record<QueryKeys, string>>;

export interface CoverAttr {
  createdAt: string;
  description: string;
  fileName: string;
  locale: string;
  updatedAt: string;
  version: number;
  volume: string;
}

export const getMangaList = async (
  params?: QueryParams,
  additionalParams?: URLSearchParams
) => {
  const queryParams = new URLSearchParams(additionalParams?.toString());
  queryParams.append("includes[]", "cover_art");
  queryParams.append("limit", "12");
  if (!!params)
    for (const [key, value] of Object.entries(params)) {
      queryParams.append(key, value);
    }

  const res = await fetch(baseUrl + "/manga" + "?" + queryParams.toString());
  if (!res.ok) throw new Error("Error fetching api from mangadex");
  const body = await res.json();

  return body as BaseResponse<"collection">;
};

export const getMangaById = async (id: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append("includes[]", "cover_art");
  queryParams.append("includes[]", "author");
  queryParams.append("includes[]", "artist");

  const res = await fetch(
    baseUrl + "/manga/" + id + "?" + queryParams.toString()
  );
  if (!res.ok) throw new Error("Error fetching api from mangadex");

  const body = await res.json();
  return body as BaseResponse<"entity">;
};

export const getMangaFeed = async (id: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append("limit", "50");
  queryParams.append("translatedLanguage[]", "en");
  queryParams.append("order[chapter]", "desc");

  const res = await fetch(
    baseUrl + "/manga/" + id + "/feed" + "?" + queryParams.toString()
  );
  if (!res.ok) throw new Error("Error fetching api from mangadex");
  const body = await res.json();

  return body;
};

export const getChapterImage = async (id: string) => {
  const res = await fetch(baseUrl + "/at-home" + "/server/" + id);
  if (!res.ok) throw new Error("Error fetching api from mangadex");

  const body = await res.json();
  return body as ChapterResponse;
};

export const getChapterData = async (id: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append("includes[]", "manga");

  const res = await fetch(
    baseUrl + "/chapter/" + id + "?" + queryParams.toString()
  );
  if (!res.ok) throw new Error("Error fetching api from mangadex");

  const body = await res.json();
  return body as BaseResponse<"entity">;
};

export const getChapterList = async (params?: URLSearchParams) => {
  const queryParams = new URLSearchParams(params?.toString());
  queryParams.append("limit", "15");
  queryParams.append("order[readableAt]", "desc");
  queryParams.append("includes[]", "manga");

  const res = await fetch(baseUrl + "/chapter" + "?" + queryParams.toString());
  if (!res.ok) throw new Error("Error fetching api from mangadex");

  const body = await res.json();
  return body as BaseResponse<"collection">;
};

export const getCoverList = async (params?: URLSearchParams) => {
  const queryParams = new URLSearchParams(params?.toString());
  queryParams.append("limit", "15");

  const res = await fetch(baseUrl + "/cover" + "?" + queryParams.toString());
  if (!res.ok) throw new Error("Error fetching api from mangadex");

  const body = await res.json();
  return body as BaseResponse<"collection">;
};
